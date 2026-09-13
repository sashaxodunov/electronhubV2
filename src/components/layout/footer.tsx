import Link from "next/link";

import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
	return (
		<footer className="border-t bg-muted/30">
			<div className="container mx-auto px-4">
				{/* Main footer */}
				<div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div>
						<Link
							href="/"
							className="inline-block font-bold tracking-tight"
						>
							<span className="text-xl">
								Electron
								<span className="text-primary">
									Hub
								</span>
							</span>
						</Link>

						<p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
							{siteConfig.description}
						</p>
					</div>

					{/* Resources */}
					<div>
						<h2 className="text-sm font-semibold">
							Ресурсы
						</h2>

						<ul className="mt-4 space-y-2">
							{footerNavigation.resources.map(
								(item) => (
									<li key={item.href}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{item.title}
										</Link>
									</li>
								),
							)}
						</ul>
					</div>

					{/* Tools */}
					<div>
						<h2 className="text-sm font-semibold">
							Инструменты
						</h2>

						<ul className="mt-4 space-y-2">
							{footerNavigation.tools.map(
								(item) => (
									<li key={item.href}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{item.title}
										</Link>
									</li>
								),
							)}
						</ul>
					</div>

					{/* Information */}
					<div>
						<h2 className="text-sm font-semibold">
							Информация
						</h2>

						<ul className="mt-4 space-y-2">
							{footerNavigation.information.map(
								(item) => (
									<li key={item.href}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{item.title}
										</Link>
									</li>
								),
							)}
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="flex flex-col gap-3 border-t py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {new Date().getFullYear()}{" "}
						{siteConfig.name}. Все права защищены.
					</p>

					<div className="flex gap-4">
						<Link
							href="/search"
							className="hover:text-foreground"
						>
							Поиск
						</Link>

						<Link
							href="/categories"
							className="hover:text-foreground"
						>
							Категории
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}