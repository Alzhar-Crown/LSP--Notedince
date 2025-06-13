    import { useState, useEffect } from "react";
    import {router} from '@inertiajs/react';



    interface Notes{
        id?: number;
        header:string;
        content:string;
    }

    interface Props{
        isOpen: boolean;
        closeModal: () => void;
        notes?: Notes | null;
    }

    export default function  NotesFromModal({ isOpen, closeModal, notes}: Props){

        const [ formData, setFormData] = useState<Notes> ({header:"", content:""});
        
        //efek modal
        useEffect(()=> {
            if(notes){
                setFormData ({header: notes.header, content: notes.content ||""});
    
            }else{
                setFormData ({header: "", content: "" });
    
            }
        }, [notes]);

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
            data.append('content', formData.content);


            if(notes?.id){
                data.append("_method", "PUT");
                router.post(`/notes/${notes.id}`, data, {
                  
                  onSuccess: () => {
                    console.log("notes?", notes);
                    closeModal();
                        router.reload();
                    },
                    onError: (errors) =>{
                        console.error(errors.message || "gagal kirim data");
                    }
                });
            }else{
                router.post("/notes",data,{
                      onSuccess: () => {
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
             <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50 z-50">
               <div className="bg-white   p-6 rounded-lg shadow-lg w-full max-w-xl">
                 <h2 className="text-lg font-semibold mb-4">{notes ? "Edit Noted" : "Add Noted"}</h2>
        <form onSubmit={handleSubmit}  encType="multipart/form-data">
          <div className="mb-3">
            <label className="block dark:text-black text-sm font-medium">Judul</label>
            <input
              type="text"
              name="header"
              value={formData.header}
              onChange={handleChange}
              className="w-full border dark:text-black  rounded p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium dark:text-black ">Konten</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border dark:text-black  rounded p-2"
              required
            ></textarea>
          </div>
         
          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{notes ? "Ubah" : "Input"}</button>
          </div>
        </form>
      </div>
    </div>
        );

    } 
