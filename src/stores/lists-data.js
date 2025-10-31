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
    {
        url: 'nama-kegiatan',
        label: 'Nama Kegiatan',
        style: 'single',
        column: 1,
        protected: false,
        sort: 'asc',
    },
];

const dataWithKey = data.map((item) => ({
    ...item,
    key: item.url.replace(/-/g, '_'),
}));

const listData = Object.values(dataWithKey).sort((a, b) => {
    return a.label > b.label ? 1 : -1;
});

export default listData;
