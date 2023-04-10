
import {useForm} from "react-hook-form";
import '../../style/darg-and-drop.css'
import CryptoUtils from "../../helper/CryptoUtils";
import {useState} from "react";
import DragAndDrop from "../DragAndDrop";

const Index = () => {

    const [name, setName] = useState(null)
    const [hashName, setHashName] = useState(null);
    const [decryptHash, setDecryptHash] = useState(null)
    const [files, setFiles] = useState([]);

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        setName(data.nom)

        const hashName = await CryptoUtils.encrypt(
            files[0],
            data.password,
            data.nom,
        );
        setHashName(hashName)

        const decryptHash = await CryptoUtils.decrypt(files[0], data.password, hashName)
        setDecryptHash(decryptHash)
    }

    return (
        <div
            className= 'm-auto flex flex-col flex-1 items-center justify-center p-16'
            style={{minWidth: '700px'}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label >Nom: </label>
                <input className='inputTest' type='text' name='nom' id='nom' {...register("nom")} /><br/><br/>
                <div>

                    <p className="mb-1">clé privé:</p>
                    <DragAndDrop
                        maxFiles={1}
                        files={files}
                        setFiles={setFiles}
                        types={['.key', '.pem', '.der']}
                    />
                </div><br/>
                <label >Phrase secrète: </label>
                <input className='inputTest' type='text' name='password' id='password' {...register("password")} /><br/><br/>
                <input type="submit" value='Cliquez pour encrypter' />
            </form>

            {name && hashName && decryptHash && (
                <div className='mt-16'>
                    <h1>Nom : {name}</h1><br/>
                    <h1>Encryptage du nom : {hashName}</h1><br/>
                    <h1>Decrytage du nom : {decryptHash}</h1><br/>
                </div>
            )}
        </div>
    );
};

export default Index;
