import { db } from "@/tools/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
/**
 * 取得初始化模板
 */
export const getGameData = async (game_id) => {
    const docRef = doc(db, "games", game_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {

        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("找不到該抽籤");
    }
};
