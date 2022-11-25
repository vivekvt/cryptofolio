import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../config/firebase";
import { IPosition } from "../types/position";

interface IPortfolio {
  positions: { [key: string]: IPosition[] };
  isPublic: boolean;
}

const initialPortfolio = {
  positions: {},
  isPublic: false,
};

export const useGetPortfolio = () => {
  const authState = useSelector((state: any) => state.auth);
  const [portfolio, setPortfolio] = useState<IPortfolio>(initialPortfolio);
  const [portfolioId, setPortfolioId] = useState(null);
  useEffect(() => {
    if (authState?.init) {
      if (authState?.uid) {
        getDataFromDatabase();
      } else {
        const data = window.localStorage.getItem("portfolio");
        setPortfolio(JSON.parse(data) || initialPortfolio);
      }
    }
  }, [authState?.uid, authState?.init]);

  const handlePortfolioChange = (changedPortfolio: Partial<IPortfolio>) => {
    const newPortfolio = { ...portfolio, ...changedPortfolio };
    setPortfolio(newPortfolio);
    if (authState?.uid) {
      saveToDatabase(newPortfolio);
    } else {
      window.localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
    }
  };

  const getDataFromDatabase = async () => {
    try {
      const q = query(
        collection(database, "portfolio"),
        where("createdBy", "==", authState.uid)
      );
      const querySnapshot = await getDocs(q);
      let existingPortfolio;
      let existingPortfolioId;
      querySnapshot.forEach((doc) => {
        if (doc.id && !existingPortfolio) {
          existingPortfolio = doc.data();
          existingPortfolioId = doc.id;
        }
      });

      if (existingPortfolio && existingPortfolioId) {
        setPortfolio(existingPortfolio);
        setPortfolioId(existingPortfolioId);
      } else {
        const data = window.localStorage.getItem("portfolio");
        if (data !== null) {
          setPortfolio(JSON.parse(data));
          await saveToDatabase(JSON.parse(data));
          window.localStorage.removeItem("portfolio");
        }
      }
    } catch (error) {
      alert(`Error, ${error.message}`);
    }
  };

  const saveToDatabase = async (newPortfolio) => {
    try {
      if (portfolioId) {
        const docRef = doc(database, "portfolio", portfolioId);
        await updateDoc(docRef, {
          ...newPortfolio,
          createdBy: authState.uid,
        });
      } else {
        const docRef = await addDoc(collection(database, "portfolio"), {
          ...newPortfolio,
          createdBy: authState.uid,
        });
        setPortfolioId(docRef.id);
      }
    } catch (error) {
      alert(`Error, ${error.message}`);
    }
  };

  return { portfolio, handlePortfolioChange };
};
