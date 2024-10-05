import { storage } from '@/../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'react-toastify';


const uploadFile = async (file = null, subjectId, where, fileName) => {
    if (!file) return

    const f = file[0];
    const storageRef = ref(storage, `/${subjectId}/${where}/${fileName}`);

    try {
        const snapshot = await uploadBytes(storageRef, f);

        const downloadedUrl = await getDownloadURL(snapshot.ref);

        console.log(downloadedUrl);

        toast.success("File sucessfully uploaded", { position: 'top-right' });

        return downloadedUrl;
    } catch (error) {
        toast.error(error.message, { position: 'top-right' });
        console.error(error)
    }
}

export default uploadFile;