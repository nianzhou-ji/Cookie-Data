const items = [
    {
        "id": "6732cf11-3dd7-42fd-a1f9-0e99416bbcaf",
        "name": "2024-03-23__20-47-12",
        "markdownData": {
            "time": 1711199020678,
            "blocks": [
                {
                    "id": "_7sJxhZQwh",
                    "type": "paragraph",
                    "data": {
                        "text": "sfdfw+",
                        "alignment": "left"
                    }
                },
                {
                    "id": "QcDGvq8Gsc",
                    "type": "attaches",
                    "data": {
                        "file": '',
                        "title": "blog.csdn.net-Qt 之connect 信号和槽函数连接的几种方法的总结含signalmaperlamda方式.pdf"
                    }
                },


                {
                    "id": "QcDGvq8Gsc",
                    "type": "attaches",
                    "data": {
                        "file": '',
                        "title": "blog.csdn.net-信号和槽函数"
                    }
                },

                {
                    "id": "7k3N5o-W8f",
                    "type": "image",
                    "data": {
                        url: '',
                        "caption": "image.png",
                        "withBorder": false,
                        "withBackground": false,
                        "stretched": false
                    }
                },
                {
                    "id": "bnZRWazdiP",
                    "type": "paragraph",
                    "data": {
                        "text": "修改了  ",
                        "alignment": "left"
                    }
                }
            ],
            "version": "2.29.0"
        },
    },
    {
        "id": "d478b78b-734d-41a6-b862-c77a17844387",
        "name": "2024-03-23__20-47-47",
        "markdownData": {
            "time": 1711198100340,
            "blocks": [
                {
                    "id": "jxIxWY9Ift",
                    "type": "paragraph",
                    "data": {
                        "text": "的v",
                        "alignment": "left"
                    }
                },
                {
                    "id": "fj_j6KXu79",
                    "type": "alert",
                    "data": {
                        "type": "info",
                        "align": "left",
                        "message": "的v的v"
                    }
                },
                {
                    "id": "NciXMsRI-g",
                    "type": "attaches",
                    "data": {
                        "file": "",
                        "title": "logo192.ico"
                    }
                }
            ],
            "version": "2.29.0"
        },

    },
    {
        "id": "9de2eefe-9f2a-47f0-8304-88833be9e948",
        "name": "test3",
        "markdownData": {
            "time": 1711198971581,
            "blocks": [
                {
                    "id": "kcCtRGbhyx",
                    "type": "paragraph",
                    "data": {
                        "text": "阿发我",
                        "alignment": "left"
                    }
                }
            ],
            "version": "2.29.0"
        },

    }
]
const items2 = [
    {
        "title": "Old Man's War",
        "author": {
            "name": "John Scalzi",
            "tags": [
                {
                    "value": "American"
                }


            ]
        }
    },
    {
        "title": "The Lock Artist",
        "author": {
            "name": "Steve Hamilton",
            "tags": [
                {
                    "value": "English"
                },

                {
                    "value": "sh"
                }


            ]
        }
    }
]


class SearchEngine {

    static  convertSearchDatabase = (value) => {
        const temp = _.cloneDeep(value)
        for (const foo1 of temp) {
            for (const foo1Element of foo1.markdownData.blocks) {

                if (foo1Element.type === 'paragraph') {
                    foo1Element['SearchedText'] = foo1Element.data.text
                }

                if (foo1Element.type === 'attaches') {
                    foo1Element['SearchedText'] = foo1Element.data.title
                    foo1Element.data.file = null
                }

                if (foo1Element.type === 'image') {
                    foo1Element['SearchedText'] = foo1Element.data.caption
                    foo1Element.data.url = null
                }
                if (foo1Element.type === 'alert') {
                    foo1Element['SearchedText'] = foo1Element.data.message

                }
            }

        }

        return temp

    }

    static fuseOptions = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        includeMatches: true,
        // findAllMatches: true,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        ignoreLocation: true,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        // keys: ['author.tags.value']
        keys: ['markdownData.blocks.SearchedText']
    };

    constructor(data) {
        this.fuse = new Fuse(SearchEngine.convertSearchDatabase(data), SearchEngine.fuseOptions);
    }


    search(searchPattern) {
        this.res = this.fuse.search(searchPattern)
        return this.res

    }


    postSearchResult() {
        if (this.res.length === 0) return
        const res = []
        for (const item1 of this.res) {
            for (const item2 of item1.matches) {
                res.push({
                    id: item1.item.id,
                    name: item1.item.name,
                    match: {
                        ...item2,
                        block: item1.item.markdownData.blocks[item2.refIndex]
                    }

                })
            }
        }
        return res
    }
}


const Fuse = require('fuse.js');
const _ = require('lodash');


// Change the pattern
const searchPattern = "信号和槽函数的v的v"


const searchObj = new SearchEngine(items)
const res22 = searchObj.search(searchPattern)
const res = searchObj.postSearchResult()




// const fuse = new Fuse(items2, fuseOptions);

// Change the pattern
// const searchPattern = "engsh"


console.log(res.length + '个结果')
console.log(JSON.stringify(res, null, 2));
console.log(res);
