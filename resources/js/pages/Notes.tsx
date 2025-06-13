import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import appLayout from "@/layouts/app-layout";
import NotesFromModal from "@/components/NotesFormModal";
import AppLayout from "@/layouts/app-layout";
import { Search } from 'lucide-react';


 interface Notes{
        id?: number;
        header:string;
        content:string;
    }

export default function Notes(){

    //codde tampilkan data dari db
     const { notes } = usePage<{ notes: Notes[] }>().props;
     const { props } = usePage();
     const successMessage = props.flash?.success;

     //handle muncul form modal
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedNotes, setSelectedNotes] = useState(null);

    const openModal = (notes = null) => {
        setSelectedNotes(notes);
        setIsModalOpen(true);
    }

    const handleDelete = (id: number) =>{
        router.delete(`/notes/${id}`,{
            onSuccess: () => {
                router.reload();
            },
            onError: () => {
                console.log("Gagal Hapus");
            }
        })
    }

    const [search, setSearch] = useState("");

    const handleSearch = () =>{
        router.get("/notes", {search},{
            preserveState: true,
            replace: true,
        });
          
    }

    const handleResetSearch = () =>{
        router.get(route('notes.index'));
    }

    return(
        <AppLayout>
            <Head title="Apps Crud"></Head>
             <div className="flex flex-col gap-6 p-6 bg-white dark:bg-black text-black shadow-lg rounded-xl">
                    <div>
                        {successMessage && (
                            <div className="bg-green-100 text-green-800 p-2  rounded mb-4">
                            {successMessage}
                            </div>
                         )}

                         {/* sisanya... */}
                     </div>
            
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                        <div className="flex w-full sm:w-auto gap-2">
                            <input
                                name="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Cari..."
                                className="w-full sm:w-64 md:w-72 outline dark:outline-white dark:text-white outline-black text-center rounded-sm px-2 py-1"
                            />
                        </div>
                          <button onClick={handleSearch}  className="p-2  rounded hover:bg-amber-300 "> <Search className="w-5 dark:text-white h-5" /></button>
                    </div>
                     <button onClick={handleResetSearch}  className=" dark:text-white p-2 border rounded-sm hover:bg-amber-500">Tampilkan Semua</button>
                    <button onClick={() => openModal()} className="bg-green-600 dark:bg-amber-500 text-white rounded !px-3 !py-1 text-sm hover:bg-green-700 transition">
                        Tambah Data 
                    </button>
                </div>
                    <table className="w-full border-collapse bg-white dark:text-white dark:bg-black text-black shadow-sm rounded-lg">
                    <thead>
                        <tr className="   text-800 border-b">
                        {[ "Judul", "Konten", "Aksi"].map((header) => (
                            <th key={header} className="border  p-3 text-left">{header}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {notes.length ? (
                            notes.map((notes) => (
                                <tr key={notes.id} className="border-b">
                                <td className="p-3">{notes.header}</td>
                                <td className="p-3">{notes.content}</td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => openModal(notes)}  className="bg-blue-500 text-sm text-white px-3 py-1 rounded">Edit</button>
                                    <button  onClick={() => handleDelete(notes.id)} className="bg-red-500 text-sm text-white px-3 py-1 rounded">Delete</button>
                                </td>
                                </tr>
                            ))
                        ) : (
                        <tr><td colSpan={4} className="text-center p-4 text-gray-600">Belum Ada Data</td></tr>
                        )}
                    </tbody>
                    </table>
            </div>

            <NotesFromModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} notes={selectedNotes} />
            
        </AppLayout>
    )
}