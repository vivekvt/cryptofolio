import { useEffect, useState } from "react";
import { ICoin } from "../types/coin";
import { apiClient } from "../utils/api";

export const useGetCoins = () => {
  const [coins, setCoins] = useState<ICoin[]>([]);
  const [status, setStatus] = useState<{ loading: boolean; error: any }>({
    loading: false,
    error: null,
  });

  const getCoins = async () => {
    try {
      setStatus((oldStatus) => ({ ...oldStatus, loading: true }));
      const { data } = await apiClient.get<ICoin[]>(
        "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
      );
      setCoins(data);
      setStatus((oldStatus) => ({ ...oldStatus, loading: false }));
    } catch (error) {
      setStatus((oldStatus) => ({ ...oldStatus, loading: false, error }));
    }
  };

  useEffect(() => {
    getCoins();
    setInterval(getCoins, 40000);
  }, []);

  return { coins, refetch: getCoins, error: status?.error };
};
