const data = [
    {
        url: 'komisariat',
        label: 'Komisariat',
        style: 'single',
        column: 1,
        protected: false,
        sort: 'asc',
    },

    {
        url: 'status',
        label: 'Status',
        style: 'single',
        column: 1,
        protected: false,
        sort: 'asc',
    },
];

const listData = Object.values(data).sort((a, b) => {
    return a.label > b.label ? 1 : -1;
});

export default listData;
