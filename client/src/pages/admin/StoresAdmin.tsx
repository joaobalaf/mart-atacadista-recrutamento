import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Card } from "../../components/ui";
import { api } from "../../services/api";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export function StoresAdmin() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    api.get<Store[]>("/admin/stores", true).then(setStores);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black text-brand-ink">Lojas</h1>
      <p className="mt-1 text-sm text-brand-gray-500">Unidades usadas no cálculo de distância dos candidatos.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stores.map((store) => (
          <Card key={store.id}>
            <p className="text-sm font-bold text-brand-ink">{store.name}</p>
            <p className="mt-1 text-sm text-brand-gray-600">{store.address}</p>
            <p className="text-sm text-brand-gray-600">{store.city}</p>
            <p className="mt-2 text-xs text-brand-gray-400">
              {store.lat.toFixed(5)}, {store.lng.toFixed(5)}
            </p>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
