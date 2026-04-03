export type TestImageSet = {
    id: string;
    label: string;
    images: string[];
};

export const TEST_IMAGE_SETS: TestImageSet[] = [
    {
        id: "set-1",
        label: "Set 1",
        images: [
            "https://t4.ftcdn.net/jpg/05/41/26/61/360_F_541266173_K545317oNZsZFC8VWFZXpYaHAy3ERlXl.jpg",
            "https://dl6pgk4f88hky.cloudfront.net/2025/01/15/202503TV.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxITyZNuUmTzqcU7IRGu0AQCO_LLoXfdE8oA&s",
        ],
    },
    {
        id: "set-2",
        label: "Set 2",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvg3mRPM6LEKL2pOmzQSO5aRg1Z2e1-Nd_A&s",
            "https://media.npr.org/assets/img/2022/12/09/meerkat-c5338ef2def39f783b720b0a0fe06ee0890488c2.jpg",
            "https://static.boredpanda.com/blog/wp-content/uploads/2016/01/funny-animals-eating-32__605.jpg",
        ],
    },
    {
        id: "set-3",
        label: "Set 3",
        images: [
            "https://i.pinimg.com/736x/70/39/5c/70395ca176be6a4945f7b1c57e0ed5bd.jpg",
            "https://pagesix.com/wp-content/uploads/sites/3/2023/10/NYPICHPDPICT000071536813.jpg",
            "https://www.hollywoodintoto.com/wp-content/uploads/2025/01/Michael-Rapaport-social-media-censorship-2.jpg",
        ],
    },
];