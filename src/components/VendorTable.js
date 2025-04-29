export default function VendorTable({ items, onEdit, onDelete, openModal }) {
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left border border-slate-200">
          <thead className="bg-slate-100 text-slate-700 font-semibold">
            <tr>
              <th className="px-4 py-3 border">Judul</th>
              <th className="px-4 py-3 border">Deskripsi</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 border">{item.title}</td>
                <td className="px-4 py-3 border">{item.description}</td>
                <td className="px-4 py-3 border text-center space-x-2">
                  <button
                    onClick={() => { onEdit(item); openModal(true); }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-slate-400">Belum ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  