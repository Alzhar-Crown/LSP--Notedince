    import { useState,useRef, useEffect } from "react";
    import { Head, router, usePage } from "@inertiajs/react";
    import appLayout from "@/layouts/app-layout";
    import NotesFromModal from "@/components/NotesFormModal";
    import AppLayout from "@/layouts/app-layout";
    import { Table,Book,Edit,X, Search, Check } from 'lucide-react';
    import { useMemo } from 'react';

import SplashCursor from '../components/SplashCursor'


 interface Notes{
        id?: number;
        header:string;
        content:string;
        created_at:Date;
    }
    
    
interface NoteForm {
  header: string;
  content: string;
}


export default function Notes(){

    
         const [ formData, setFormData] = useState<NoteForm> ({header:"", content:""});
         const { notes : rawNotes } = usePage<{ notes: Notes[] }>().props;
         const notes:Notes[] = useMemo(()=>{
            return rawNotes.map(note => ({
                ...note,
                created_at:new Date(note.created_at),
            }));
         }, [rawNotes]);
         const { props } = usePage();
                 
         
         
         
         //codde tampilkan data dari db
         const successMessage = props.flash?.success;
         
     //handle muncul form modal
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedNotes, setSelectedNotes] = useState(null);
    
    const openModal = (notes = null) => {
        setSelectedNotes(notes);
        setIsModalOpen(true);
    }
    
    const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
    
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
    const handleDeleteAll = () =>{
        router.delete('notesD',{
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
    //selanjutnya untuk handle input form
    const handleSubmit =(e: React.FormEvent) => {
        e.preventDefault();

        //ambil data dari inputan
        const data = new FormData();
        data.append('header', formData.header);
        data.append('content', formData.content);


           
            router.post("/notes",data,{
                  onSuccess: () => {
                    setFormData({header:"",content:""})
                    router.reload();
                },
                onError: (errors) =>{
                    console.error(errors.message || "gagal kirim data");
                }
            })
        
    }
    return(
        <AppLayout>
            {/* <SplashCursor /> */}
            {/* <SplashCursor /> */}
            
            <Head title="Apps Crud"></Head>
             <div className="flex flex-col gap-6 p-6 bg-white dark:bg-black text-black shadow-lg rounded-xl">
                    <div>
                        {successMessage && (
                            <div className="bg-green-400 backdrop-blur-xl text-black dark:text-white  p-2  rounded mb-4">
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
                     <button onClick={handleResetSearch}  className=" dark:text-white p-2 transition-all duration-150 border rounded-sm hover:bg-amber-500">Tampilkan Semua</button>
                     <button onClick={handleDeleteAll}  className=" dark:text-white p-2 transition-all duration-150 border rounded-sm hover:bg-red-500">Hapus Semua</button>
                    <button onClick={() => openModal()} className="bg-green-600 dark:bg-amber-500 text-white rounded !px-3 !py-1 text-sm hover:bg-green-700 transition">
                         Buat Catatan
                    </button>
                </div>
                {viewMode ==='table' ? (
                    <>
                    <table className="w-full table-fixed border-spacing-x-4 border-collapse bg-white dark:text-white dark:bg-black text-black shadow-sm rounded-lg">
                    <thead>
                        <tr className="   text-800 border-b">
                        {[ "Judul", "Catatan","Dibuat Pada", "Aksi"].map((header) => (
                            <th key={header} className="border  p-3 text-left">{header}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {notes.length ? (
                            notes.map((notes) => (
                                <tr key={notes.id} className="border-b">
                                <td className="p-3"><span className="bg-orange-950 text-white  px-2 py-1 rounded-md">{notes.header}</span></td>
                                <td className="p-3 max-h-[10px] lg:text-sm text-[15px] lg:h-fit overflow-y-auto lg:max-w-4xs max-w-xs break-words ">{notes.content}</td>
                                <td className="p-3   h"><span className="border border-blue-500 bg-transparent backdrop-blur-xl  px-2 py-1 rounded-md">{notes.created_at.toLocaleDateString('id-ID')}</span></td>
                                <td className="p-3 sm:max-w-sm break-words flex flex-wrap gap-2">
                                    <button onClick={() => openModal(notes)}  className="bg-white/3 text-black dark:text-white shadow shadow-gray-350    backdrop-blur-3xl  dark:shadow-gray-800 hover:bg-amber-300 transition-all duration-100 text-sm  px-3 py-1 rounded">Edit</button>
                                    <button  onClick={() => handleDelete(notes.id)} className="bg-red-500 text-sm text-white px-3 py-1 rounded">Hapus</button>
                                </td>
                                </tr>
                            ))
                        ) : (
                        <tr><td colSpan={4} className="text-center p-4 text-gray-600">Belum ada catatan</td></tr>
                        )}
                    </tbody>
                    </table>
                    <footer>
                        <div className="flex gap-2  justify-end">
                   
                            <Book
                                onClick={() => setViewMode('card')}
                                className={`px-3 py-1 w-10 h-10 rounded ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            />
                           
                         </div>
                    </footer>
                    </>
                    
                ):(
                    <div className="">

                        <div className="">
                            {notes.length ? (
                                <div className="flex flex-wrap gap-4 ">

                                {notes.map((notes) => (
                                    <div key={notes.id} className=" border shadow gap-2 shadow-gray-200  flex flex-col p-4 justify-between rounded-sm ">
                                    <div className="flex flex-col">
                                            <button  onClick={() => handleDelete(notes.id)}  >
                                                <X className=" text-black dark:text-white hover:-translate-y-1 tansition-all duration-150 px-3 py-1 rounded w-10 h-10   " />
                                            </button>
                                       <span className="p-3"><span className=" dark:text-white text-black font-bold">{notes.header}</span> 
                                       </span>
                                      <span className="p-2 rounded-sm max-h-[100px] dark:text-white lg:text-sm text-[15px] lg:h-fit overflow-y-auto lg:max-w-4xs max-w-xs break-words ">{notes.content}</span>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <span className="p-3   "><span className="border    text-black dark:text-white text-[12px]  bg-transparent backdrop-blur-xl  px-2 py-1 rounded-md">{notes.created_at.toLocaleDateString('id-ID')}</span></span>
                                        <span className="p-3 sm:max-w-sm break-words flex flex-wrap gap-2">
                                            <Edit onClick={() => openModal(notes)}  className="bg-black/3 w-10 h-10 text-black dark:text-white shadow shadow-gray-350 backdrop-blur-3xl  dark:shadow-gray-800 hover:-translate-y-1 transition-all duration-100 text-sm  px-3 py-1 rounded" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <form onSubmit={handleSubmit}  encType="multipart/form-data">

                             <div  className=" border shadow gap-2 shadow-gray-200 flex flex-col p-4 justify-between rounded-sm ">
                                    <div className="flex flex-col">
                                           
                                       <span className="p-2"><input onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                                             name="header" className=" dark:text-white p-2 rounded-sm text-black border  font-bold" placeholder="Ketikan sesuatu..."></input> 
                    
                                       </span>
                                      <span className="p-2 rounded-sm  dark:text-white lg:text-sm text-[15px] lg:h-fit overflow-y-auto lg:max-w-4xs max-w-xs break-words ">
                                      <textarea   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                         name="content"  className=" p-2 dark:text-white text-black border rounded-sm h-[100px]  font-bold" placeholder="Ketikan sesuatu..." ></textarea>
                                      </span>

                                    </div>
                                    <div className="flex flex-row justify-end">
                                       <button type="submit" >
                                                <Check className=" text-black dark:text-white hover:-translate-y-1 transition-all duration-150 px-3 py-1 rounded w-10 h-10   " />
                                            </button>
                                    </div>
                                </div>  
                             </form>

                           
                        </div>
                              ) : (
                        <tr><td colSpan={4} className="text-center p-4 text-gray-600">Belum ada catatan</td></tr>
                        )}
                        </div>
                    <footer>
                        <div className="flex gap-2 justify-end">
                            <Table
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1 w-10 h-10 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            />
                            
                        </div>
                    </footer>
                    </div>

                )}
            </div>
            

            <NotesFromModal    isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} notes={selectedNotes} />
            
        </AppLayout>
    );
} ;