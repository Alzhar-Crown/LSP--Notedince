    import { useState } from "react";
    import { Head, router, usePage } from "@inertiajs/react";
    import appLayout from "@/layouts/app-layout";
    import NotesFromModal from "@/components/NotesFormModal";
    import AppLayout from "@/layouts/app-layout";
    import { Check,Table,Book,Edit,X, Search } from 'lucide-react';
    import { useMemo } from 'react';

import SplashCursor from '../components/SplashCursor'
import TodoFromModal from "@/components/TodoFormModal";


 interface Todo{
        id?: number;
        header:string;
        created_at:Date;
    }

export default function Todo(){

    

    //codde tampilkan data dari db
     const { todo : rawTodo } = usePage<{ todo: Todo[] }>().props;
     const todo:Todo[] = useMemo(()=>{
        return rawTodo.map(todo => ({
            ...todo,
            created_at:new Date(todo.created_at),
        }));
     }, [rawTodo]);
     const { props } = usePage();
     const successMessage = props.flash?.success;

     //handle muncul form modal
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedTodo, setSelectedTodo] = useState(null);

    const openModal = (todo = null) => {
        setSelectedTodo(todo);
        setIsModalOpen(true);
    }

    const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

    const handleDelete = (id: number) =>{
        router.delete(`/todo/${id}`,{
            onSuccess: () => {
                router.reload();
            },
            onError: () => {
                console.log("Gagal Hapus");
            }
        })
    }
    const handleDeleteAll = () =>{
        router.delete('todoD',{
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
        router.get("/todo", {search},{
            preserveState: true,
            replace: true,
        });
          
    }

    const handleResetSearch = () =>{
        router.get(route('todo.index'));
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
            
                <div className="flex flex-col gap-3  sm:flex-row sm:justify-between sm:items-center">
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
                          <button onClick={handleSearch}  className="p-2  rounded hover:bg-violet-600 "> <Search className="w-5 dark:text-white h-5" /></button>
                    </div>
                     <button onClick={handleResetSearch}  className=" dark:text-white p-2 transition-all duration-150 border rounded-sm hover:bg-violet-500">Tampilkan Semua</button>
                     <button onClick={handleDeleteAll}  className=" dark:text-white p-2 transition-all duration-150 lg:min-w-[120px] border hover:shadow  hover:shadow-gray-500 hover:brightness-200 rounded-sm ">Selesai Semua</button>
                    <button onClick={() => openModal()} className="bg-green-600 dark:bg-violet-500 text-white rounded !px-3 !py-1 text-sm hover:bg-green-700 transition">
                         Buat Kegiatan
                    </button>
                </div>
                {viewMode ==='table' ? (
                    <>
                    <table className=" table-fixed border-spacing-x-4 border-collapse bg-white dark:text-white dark:bg-black text-black shadow-sm rounded-lg">
                    <thead>
                        <tr className="   text-800 border-b">
                        {[ "Kegiatan","Dibuat Pada", "Aksi"].map((header) => (
                            <th key={header} className="border  p-3 text-left">{header}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {todo.length ? (
                            todo.map((todo) => (
                                <tr key={todo.id} className="border-b">
                                <td className="p-3"><span className="bg-orange-950 text-white  px-2 py-1 rounded-md">{todo.header}</span></td>
                                <td className="p-3   h"><span className="border border-blue-500 bg-transparent backdrop-blur-xl  px-2 py-1 rounded-md">{todo.created_at.toLocaleDateString('id-ID')}</span></td>
                                <td className="p-3 sm:max-w-sm break-words flex flex-wrap gap-2">
                                    <button onClick={() => openModal(todo)}  className="bg-white/3 text-black dark:text-white shadow shadow-gray-350    backdrop-blur-3xl  dark:shadow-gray-800 hover:bg-amber-300 transition-all duration-100 text-sm  px-3 py-1 rounded">Edit</button>
                                    <button  onClick={() => handleDelete(todo.id)} className="bg-red-500 text-sm text-white px-3 py-1 rounded">Tandai Selesai</button>
                                </td>
                                </tr>
                            ))
                        ) : (
                        <tr><td colSpan={4} className="text-center p-4 text-gray-600">Belum ada Kegiatan</td></tr>
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

                        <div className="flex flex-wrap gap-4 ">
                            {todo.length ? (
                            todo.map((todo) => (
                                <div key={todo.id} className=" border max-w-[330px] lg:max-w-full px-2 shadow gap-2 shadow-gray-200 flex justify-center flex-row p-4 items-center rounded-sm ">
                                    <div className="flex flex-row">
                                            <button  onClick={() => handleDelete(todo.id)}  >
                                                <Check className=" text-black dark:text-white hover:-translate-y-1 transition-all duration-150 px-3 py-1 rounded w-10 h-10   " />
                                            </button>
                                       <span className="p-3"><span className=" dark:text-white text-black font-bold">{todo.header}</span> 
                                       </span>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <span className="p-3  mt-2"><span className="border    text-black dark:text-white text-[12px]  bg-transparent backdrop-blur-xl  px-2 py-1 rounded-md">{todo.created_at.toLocaleDateString('id-ID')}</span></span>
                                        <span className="p-3 sm:max-w-sm break-words flex flex-wrap gap-2">
                                            <Edit onClick={() => openModal(todo)}  className="bg-black/3 w-10 h-10 text-black dark:text-white shadow shadow-gray-350 backdrop-blur-3xl  dark:shadow-gray-800 hover:-translate-y-1 transition-all duration-100 text-sm  px-3 py-1 rounded" />
                                        </span>
                                    </div>
                                </div>
                            ))
                              ) : (
                        <tr><td colSpan={4} className="text-center p-4 text-gray-600">Belum ada Kegiatan</td></tr>
                        )}
                        </div>
                    <footer>
                        <div className="flex gap-2 mt-4 justify-end">
                            <Table
                                onClick={() => setViewMode('table')}
                                className={`px-3 w-10  py-1 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            />
                        </div>
                    </footer>
                    </div>

                )}
            </div>
            

            <TodoFromModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} todo={selectedTodo} />
            
        </AppLayout>
    )
}