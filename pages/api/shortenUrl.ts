// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import prisma from "../../lib/prisma";

interface UrlData {
	longUrl: string;
	shortUrl: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { longUrl, shortUrl }: UrlData = req.body;

	try {
		const findUrl = await prisma.link.findUnique({
			where: {
				shortUrl: shortUrl,
			},
		});

		if (findUrl) {
			return res.status(500).json({ errorMessage: `${process.env.NEXT_PUBLIC_SITE_URL}${shortUrl} is already taken.` });
		}

		await prisma.link.create({
			data: {
				longUrl,
				shortUrl,
			},
		});
	} catch (err) {
		res.status(500);
		resolve();
	}

	return res.status(200).json(shortUrl);
}
