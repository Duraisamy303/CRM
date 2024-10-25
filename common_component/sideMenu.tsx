import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleTheme, toggleSemidark } from '../store/themeConfigSlice';
import IconSettings from '@/components/Icon/IconSettings';
import IconX from '@/components/Icon/IconX';
import IconSun from '@/components/Icon/IconSun';
import IconMoon from '@/components/Icon/IconMoon';
import IconLaptop from '@/components/Icon/IconLaptop';

interface sidebarProps {
    open: boolean;
    close: any;
    title: string;
    renderComponent: any;
}

export default function SideMenu(props: sidebarProps) {
    const { open, close, title, renderComponent } = props;

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
            <div className={`${(open && '!block') || ''} fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`} onClick={() => close()}></div>

            <nav
                className={`${
                    (open && 'ltr:!right-0 rtl:!left-0') || ''
                } fixed bottom-0 top-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 ltr:-right-[400px] rtl:-left-[100px] dark:bg-black`}
            >
                <div className="perfect-scrollbar h-full overflow-y-auto overflow-x-hidden">
                    <div className="relative pb-5 text-center">
                        <button type="button" className="absolute top-0 opacity-30 hover:opacity-100 ltr:right-0 rtl:left-0 dark:text-white" onClick={() => close()}>
                            <IconX className="h-5 w-5" />
                        </button>

                        <h4 className="mb-1 text-lg font-bold dark:text-white">{title}</h4>
                    </div>

                    {renderComponent()}
                </div>
            </nav>
        </div>
    );
}
