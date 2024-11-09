import { Models, PrivateRouter, Validation } from '@/utils/imports.utils';
import React, { useEffect } from 'react';
import { Dropdown, Failure, Success, objIsEmpty, roundOff, useSetState } from '@/utils/functions.utils';
import CommonLoader from './elements/commonLoader';
import dynamic from 'next/dynamic';
import { DataTable } from 'mantine-datatable';
import IconEdit from '@/components/Icon/IconEdit';
import IconEye from '@/components/Icon/IconEye';
import { useRouter } from 'next/router';
import CustomSelect from '@/components/Select';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import useDebounce from '@/common_component/useDebounce';
import SideMenu from '@/common_component/sideMenu';
import InputRange from '../common_component/slider';
import IconFilter from '@/components/Icon/IconFilter';
import IconUser from '@/components/Icon/IconUser';
import IconPlus from '@/components/Icon/IconPlus';
import OppCard from '@/components/oppCard';
import IconSearch from '@/components/Icon/IconSearch';
import Header from '@/components/Layouts/Header';
import Chip from '@/components/chip';
import Tippy from '@tippyjs/react';
import IconUserPlus from '@/components/Icon/IconUserPlus';
import Modal from '@/common_component/modal';
import TextArea from '@/components/TextArea';
import IconLoader from '@/components/Icon/IconLoader';
import moment from 'moment';
import * as Yup from 'yup';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Index = () => {
    const router = useRouter();

    const [state, setState] = useSetState({
        data: [], // Initial empty state for data
        sortColumn: '', // Sorting column state
        sortOrder: 'asc',
    });

    // Sample data array
    const initialData = [
        { name: 'Durai', id: 1 },
        { name: 'Aurai', id: 2 },
        { name: 'Surai', id: 3 },
        { name: 'Vurai', id: 4 },
        { name: 'Wurai', id: 5 },
    ];

    // Initialize state with data on component mount
    useEffect(() => {
        setState({ data: initialData });
    }, []);

    // Handle sorting
    const handleSort = (column: string) => {
        const newSortOrder = state.sortColumn === column && state.sortOrder === 'asc' ? 'desc' : 'asc';
        setState({ sortColumn: column, sortOrder: newSortOrder });

        // Sort data based on current sort column and order
        const sortedData = [...state.data].sort((a, b) => {
            if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        // Update state with sorted data
        setState({ data: sortedData });
    };

    return (
        <>
            <DataTable
                className="table-responsive w-full overflow-x-auto" // Full width and scrollable on small screens
                records={state.data} // Pass state data to records
                columns={[
                    {
                        accessor: 'name',
                        title: (
                            <span
                                onClick={() => handleSort('name')} // Trigger sorting by clicking the header
                                className="cursor-pointer font-semibold md:font-normal" // Bold when active
                                style={{
                                    fontWeight: 'normal',
                                    fontSize: '1rem', // Adjust font size for readability
                                }}
                            >
                                Name {state.sortColumn === 'name' ? (state.sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </span>
                        ),
                        sortable: true,
                        render: (row:any) => <span style={{ fontSize: '1rem' }}>{row.name}</span>,
                    },
                    {
                        accessor: 'actions',
                        title: 'Actions',
                        render: (row) => (
                            <div className="mx-auto flex w-max items-center gap-4">
                                <Tippy content="Assign To" className="rounded-lg bg-black p-1 text-sm text-white">
                                    <button type="button" className="flex p-1 hover:text-primary md:p-2" onClick={() => setState({ isOpenAssign: true, leadId: row.id })}>
                                        <IconUserPlus />
                                    </button>
                                </Tippy>
                                <button type="button" className="flex p-1 hover:text-primary md:p-2" onClick={() => router.push(`/viewLead?id=${row.id}`)}>
                                    <IconEye />
                                </button>
                                <button className="flex p-1 hover:text-info md:p-2" onClick={() => router.push(`/updateLead?id=${row.id}`)}>
                                    <IconEdit className="h-4 w-4" />
                                </button>
                            </div>
                        ),
                    },
                ]}
                highlightOnHover
                totalRecords={state.data.length}
                recordsPerPage={state.pageSize}
                minHeight={200}
                page={null}
                onPageChange={() => {}}
                withBorder={true}
                paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
            />
        </>
    );
};

export default PrivateRouter(Index);
