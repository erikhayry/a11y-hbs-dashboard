import path from 'path';
import { promises as fs } from 'fs';
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    const jsonDirectory = path.join(path.resolve('./db'), '/results.json');
    const fileContents = await fs.readFile(jsonDirectory, 'utf8');

    res.status(200).json(fileContents);
}