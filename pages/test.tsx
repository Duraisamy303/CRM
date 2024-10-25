import Sidebar from '@/common_component/sidebar';
import IconMenu from '@/components/Icon/IconMenu';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Test() {
    const [open, setOpen] = useState(false);
    return (
       <Sidebar />
    );
}
