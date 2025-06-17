    import { useState, useEffect } from "react";
    import {router} from '@inertiajs/react';
    import Aurora from './Aurora';



    interface Todo{
        id?: number;
        header:string;
    }

    interface Props{
        isOpen: boolean;
        closeModal: () => void;
        todo?: Todo | null;
    }

    export default function  TodoFromModal({ isOpen, closeModal, todo}: Props){

        const [ formData, setFormData] = useState<Todo> ({header:""});
        
        //efek modal
        useEffect(()=> {
            if(todo){
                setFormData ({header: todo.header ||""});
    
            }else{
                setFormData ({header: ""});
    
            }
        }, [todo]);

        //setting element text area
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
            setFormData({...formData, [e.target.name]: e.target.value});

        }


        //selanjutnya untuk handle input form
        const handleSubmit =(e: React.FormEvent) => {
            e.preventDefault();

            //ambil data dari inputan
            const data = new FormData();
            data.append('header', formData.header);


            if(todo?.id){
                data.append("_method", "PUT");
                router.post(`/todo/${todo.id}`, data, {
                  
                  onSuccess: () => {
                    console.log("todo?", todo);
                    closeModal();
                        router.reload();
                    },
                    onError: (errors) =>{
                        console.error(errors.message || "gagal kirim data");
                    }
                });
            }else{
                router.post("/todo",data,{
                      onSuccess: () => {
                        setFormData({header:""})
                        closeModal();
                        router.reload();
                    },
                    onError: (errors) =>{
                        console.error(errors.message || "gagal kirim data");
                    }
                })
            }
        }
    



        if(!isOpen) return null;

        return(
          <div className="fixed inset-0 flex items-center justify-center w-full bg-white  dark:bg-black  bg-opacity-50 z-50">
            
               <Aurora 
                   colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                   blend={0.5}
                   amplitude={1.0}
                   speed={0.5}
                 />
               <div className=" bg-opacity-8 relative  w-full p-6 rounded-lg shadow backdrop-blur-xl shadow-gray-800 z-40 max-w-xl">
                 <h2 className="text-lg font-semibold mb-4">{todo ? "Edit Kegiatan" : "Add Kegiatan"}</h2>
        <form onSubmit={handleSubmit}  encType="multipart/form-data">
          <div className="mb-3">
            <label className="block dark:text-white text-sm font-medium">Kegiatan</label>
            <input
              type="text"
              name="header"
              value={formData.header}
              onChange={handleChange}
              className="w-full border dark:text-white  rounded p-2"
              required
            />
          </div>
          
         
          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{todo ? "Ubah" : "Input"}</button>
          </div>
        </form>
      </div>
    </div>
        );

    } 
