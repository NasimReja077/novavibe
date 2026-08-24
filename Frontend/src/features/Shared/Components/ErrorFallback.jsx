import { isRouteErrorResponse, useRouteError } from "react-router";

const ErrorFallback = ({ error, onRetry }) => {
	const status = isRouteErrorResponse(error) ? error.status : null;
	const message = isRouteErrorResponse(error)
		? error.statusText || error.data
		: error?.message;

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
			<section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
				<div className="mb-4 text-5xl" aria-hidden="true">
					⚠️
				</div>
				<h1 className="mb-2 text-2xl font-bold text-gray-800">
					Something went wrong
				</h1>
				<p className="mb-6 text-gray-500">
					{status ? `Error ${status}: ` : "We couldn't load this part of the application."}
					{status && message}
				</p>
				<button
					type="button"
					onClick={onRetry ?? (() => window.location.reload())}
					className="rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
				>
					Try Again
				</button>
				{import.meta.env.DEV && error && (
					<pre className="mt-6 overflow-auto rounded-lg bg-gray-100 p-4 text-left text-xs text-red-500">
						{error.toString()}
					</pre>
				)}
			</section>
		</main>
	);
};

export const RouteErrorFallback = () => {
	return <ErrorFallback error={useRouteError()} />;
};

export default ErrorFallback;
