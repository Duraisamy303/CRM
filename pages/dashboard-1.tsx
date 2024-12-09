import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, SimpleGrid, Text, Title } from '@mantine/core';
import Chart from 'react-apexcharts';

// Dynamically import ReactApexChart for SSR compatibility
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    

    // Chart configurations
    const leadSourceChart = {
        series: [45, 25, 15, 10, 5],
        options: {
            chart: { type: 'donut', height: '100px' },
            labels: ['Website', 'Social Media', 'Referrals', 'Ads', 'Others'],
            colors: ['#1B998B', '#E84855', '#F9C22E', '#A8C686', '#374785'],
        },
    };

    const salesPerformanceChart = {
        series: [{ name: 'Revenue', data: [30000, 35000, 40000, 45000, 50000] }],
        options: {
            chart: { type: 'line' },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
        },
    };

    const leadConversionChart = {
        series: [70],
        options: {
            chart: { type: 'radialBar' },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        value: { formatter: (val) => `${val}%` },
                    },
                },
            },
            colors: ['#FF5722'],
        },
    };

    const revenueChart = {
        series: [
            { name: 'Income', data: [10000, 12000, 15000, 17000, 20000] },
            { name: 'Expenses', data: [8000, 10000, 14000, 16000, 18000] },
        ],
        options: {
            chart: { type: 'area' },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
            colors: ['#1B55E2', '#E7515A'],
        },
    };

    const topPerformingSalesChart = {
        series: [{ name: 'Sales', data: [300, 400, 500, 200, 300] }],
        options: {
            chart: { type: 'bar' },
            xaxis: { categories: ['Alice', 'Bob', 'Charlie', 'Dave', 'Emma'] },
            colors: ['#4CAF50'],
        },
    };

    const pipelineValueByStageChart = {
        series: [25, 35, 20, 20],
        options: {
            chart: { type: 'pie' },
            labels: ['Prospecting', 'Qualified', 'Proposal', 'Negotiation'],
            colors: ['#FFC107', '#03A9F4', '#8BC34A', '#FF5722'],
        },
    };

    const customerRetentionRateChart = {
        series: [85],
        options: {
            chart: { type: 'radialBar' },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        value: { formatter: (val) => `${val}%` },
                    },
                },
            },
            colors: ['#673AB7'],
        },
    };

    const taskCompletionStatusChart = {
        series: [60, 20, 20],
        options: {
            chart: { type: 'donut' },
            labels: ['Completed', 'Pending', 'Overdue'],
            colors: ['#4CAF50', '#FFC107', '#F44336'],
        },
    };

    const customerFeedbackChart = {
        series: [{ name: 'Feedback', data: [80, 70, 90, 85, 75] }],
        options: {
            chart: { type: 'bar' },
            xaxis: { categories: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'] },
            colors: ['#00BCD4'],
        },
    };
    const cardData = [
        { title: 'Leads by Month', monthCount: 150, todayCount: 25, icon: '🔗' },
        { title: 'Revenue', monthCount: 150, todayCount: '$20,000', icon: '💰' },
        { title: 'Active BDMs', monthCount: 150, todayCount: 2, icon: '👨‍💼' },
        { title: 'Pending Tasks', monthCount: 150, todayCount: 3, icon: '⏳' },
        { title: 'Sales This Month', monthCount: 150, todayCount: '$5,000', icon: '💵' },
        { title: 'Total Target', monthCount: 150, todayCount: '$10,000', icon: '🎯' },
        { title: 'Total Contacts', monthCount: 150, todayCount: 15, icon: '📞' },
    ];

    const cardsData = [
        { title: 'Total Users', count: '1,024', graphData: [12, 19, 3, 5, 2, 3] },
        { title: 'New Leads', count: '254', graphData: [5, 6, 8, 12, 15, 9] },
        { title: 'Sales Today', count: '67', graphData: [2, 3, 6, 9, 12, 15] },
        { title: 'Revenue', count: '$12,430', graphData: [10, 15, 20, 25, 30, 35] },
    ];

    const createGraph = (data) => ({
        options: {
            chart: {
                type: 'line',
                zoom: { enabled: false },
                toolbar: { show: false },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1e90ff'],
            grid: { show: false },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                labels: { style: { colors: '#fff' } },
            },
            yaxis: {
                labels: { style: { colors: '#fff' } },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 0.5,
                    opacityFrom: 0.5,
                    opacityTo: 0.1,
                    stops: [0, 100],
                },
            },
        },
        series: [
            {
                name: 'Performance',
                data,
            },
        ],
    });

    const backgroundColors = [
        'linear-gradient(135deg, #ff7e5f, #feb47b)', // Gradient 1
        'linear-gradient(135deg, #6a11cb, #2575fc)', // Gradient 2
        'linear-gradient(135deg, #00c6ff, #0072ff)', // Gradient 3
        'linear-gradient(135deg, #ff9a8b, #ffc3a0)', // Gradient 4
        'linear-gradient(135deg, #e44d26, #f7b731)', // Gradient 5
        'linear-gradient(135deg, #6b6b6b, #b3b3b3)', // Gradient 6
        'linear-gradient(135deg, #f093fb, #f5576c)', // Gradient 7
    ];

    return (
        <div className="flex flex-col gap-4 p-2">
            <SimpleGrid
                cols={4}
                spacing="sm"
                breakpoints={[
                    { maxWidth: 768, cols: 2 },
                    { maxWidth: 576, cols: 1 },
                ]}
            >
                {cardData.map((card, index) => (
                    <Card
                        key={index}
                        shadow="sm"
                        radius="lg"
                        p="md"
                        style={{
                            background: backgroundColors[index], // Linear gradient background
                            color: '#fff', // Text color for better contrast
                            transition: 'transform 0.3s ease, opacity 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'; // Slight zoom on hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'; // Reset zoom
                        }}
                    >
                        
                        <div className="flex items-center gap-4">
                            <Title size="30px" weight={600} mt="xs">
                                {card.icon}
                            </Title>
                            <Text size="lg" weight={600} mt="xs">
                                {card.title}
                            </Text>
                        </div>

                        <div className="flex items-center gap-8 ">
                            <div className="flex items-center gap-2">
                                <Title size="10px" weight={600} mt="xs">
                                    By Today
                                </Title>
                                <Text size="25px" weight={600} mt="xs">
                                    {card.monthCount}
                                </Text>
                            </div>
                            <div className="flex items-center gap-2">
                                <Title size="10px" weight={600} mt="xs">
                                    By Month
                                </Title>
                                <Text size="25px" weight={600} mt="xs">
                                    {card.monthCount}
                                </Text>
                            </div>
                        </div>
                    </Card>
                ))}
            </SimpleGrid>
            <SimpleGrid cols={2} spacing="lg">
                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Lead Source</Title>
                    {isMounted && <ReactApexChart options={leadSourceChart.options} series={leadSourceChart.series} type="donut" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Sales Performance</Title>
                    {isMounted && <ReactApexChart options={salesPerformanceChart.options} series={salesPerformanceChart.series} type="line" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Lead Conversion</Title>
                    {isMounted && <ReactApexChart options={leadConversionChart.options} series={leadConversionChart.series} type="radialBar" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Revenue vs Expenses</Title>
                    {isMounted && <ReactApexChart options={revenueChart.options} series={revenueChart.series} type="area" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Top Performing Sales</Title>
                    {isMounted && <ReactApexChart options={topPerformingSalesChart.options} series={topPerformingSalesChart.series} type="bar" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Pipeline Value by Stage</Title>
                    {isMounted && <ReactApexChart options={pipelineValueByStageChart.options} series={pipelineValueByStageChart.series} type="pie" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Customer Retention Rate</Title>
                    {isMounted && <ReactApexChart options={customerRetentionRateChart.options} series={customerRetentionRateChart.series} type="radialBar" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Task Completion Status</Title>
                    {isMounted && <ReactApexChart options={taskCompletionStatusChart.options} series={taskCompletionStatusChart.series} type="donut" />}
                </Card>

                <Card shadow="sm" radius="lg">
                    <Title size={'20px'}>Customer Feedback</Title>
                    {isMounted && <ReactApexChart options={customerFeedbackChart.options} series={customerFeedbackChart.series} type="bar" />}
                </Card>
            </SimpleGrid>
        </div>
    );
}
