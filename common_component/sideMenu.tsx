import IconX from '@/components/Icon/IconX';
import { useEffect } from 'react';

interface SidebarProps {
    open: boolean;
    close: () => void;
    title: string;
    renderComponent: () => JSX.Element;
    width?: number; // Allow width as an optional prop
}

export default function SideMenu(props: SidebarProps) {
    const { open, close, title, renderComponent, width = 450 } = props; // Set default width to 450

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <div>
            {/* Overlay */}
            <div 
                className={`${open ? '!block' : 'hidden'} fixed inset-0 z-[51] bg-[black]/60 px-4 transition-[display]`}
                onClick={() => close()}
            ></div>

            {/* Sidebar Menu */}
            <nav
                className={`${
                    open ? 'ltr:!right-0 rtl:!left-0' : ''
                } fixed bottom-0 top-0 z-[51] w-full bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 dark:bg-black`}
                style={{ maxWidth: `${width}px`, right: open ? 0 : `-${width}px` }}
            >
                <div className="perfect-scrollbar h-full overflow-y-auto overflow-x-hidden">
                    {/* Title and Close Button */}
                    <div className="relative pb-5 text-center">
                        <button
                            type="button"
                            className="absolute top-0 opacity-30 hover:opacity-100 ltr:right-0 rtl:left-0 dark:text-white"
                            onClick={() => close()}
                        >
                            <IconX className="h-5 w-5" />
                        </button>
                        <h4 className="mb-1 text-lg font-bold dark:text-white">{title}</h4>
                    </div>

                    {/* Render Component */}
                    {renderComponent()}
                </div>
            </nav>
        </div>
    );
}
