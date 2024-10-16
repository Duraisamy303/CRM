import { Models, PrivateRouter } from '@/utils/imports.utils';
import React, { useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useSetState } from '@/utils/functions.utils';

const Index = () => {
    const [state, setState] = useSetState({
        data: [],
        loading:false,
        
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const body = { name: 'hii' };
            const response = await Models.user.userList(body);
            console.log('response: ', response);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    return (
        <div className="panel mb-5 flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
                <h5 className="text-lg font-semibold dark:text-white-light">Leads</h5>
            </div>
            <div className="flex gap-5">
                <button type="button" className="btn btn-primary  w-full md:mb-0 md:w-auto" onClick={() => window.open('/apps/product/add', '_blank')}>
                    + Create
                </button>
            </div>
        </div>
    );
};

export default PrivateRouter(Index);
