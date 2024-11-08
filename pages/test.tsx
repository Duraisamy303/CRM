import Breadcrumb from '@/common_component/breadcrumb';
import React from 'react';

const Test = () => {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: 'Electronics', path: '/products/electronics' },
        { label: 'Laptops', path: '/products/electronics/laptops' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
        </div>
    );
};

export default Test;
