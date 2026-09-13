"use client";

import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
			<h1 className="text-3xl font-bold">
				Что-то пошло не так
			</h1>

			<p className="mt-3 max-w-md text-muted-foreground">
				Произошла непредвиденная ошибка. Попробуйте
				загрузить страницу ещё раз.
			</p>

			<button
				type="button"
				onClick={() => reset()}
				className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
			>
				Попробовать снова
			</button>
		</main>
	);
}