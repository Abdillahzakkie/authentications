import { generateLoginSignatureData as _generateLoginSignatureData } from "../../constants";

export default async function generateLoginSignatureData(deadline: number) {
    const result = _generateLoginSignatureData(deadline);
    if (!result) return null;
    return result;
}
