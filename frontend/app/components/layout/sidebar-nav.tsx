import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    isCollapsed: boolean;
    className?: string;
    items: {
        title: string;
        icon: LucideIcon;
        href: string;
    }[];
}


export const SidebarNav = ({
    isCollapsed,
    className,
    items,
    ...props
}: SidebarNavProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <nav
            {...props}
            className={cn("flex flex-col gap-y-2", className)} {...props}
        >
            {items.map((el) => {
                const Icon = el.icon;
                const isActive = location.pathname === el.href;

                return (
                    <Button
                        key={el.href}
                        variant={isActive ? "outline" : "ghost"}
                        size="icon"
                        className={cn("justify-start", isActive && "bg-primary/10")}
                    >
                        <Icon className="mr-2 size-4" />
                        {
                            isCollapsed ? (
                                <span className="sr-only">{el.title}</span>
                            ) : (
                                <span>{el.title}</span>
                            )
                        }
                    </Button>
                )
            })}
        </nav>
    )
}