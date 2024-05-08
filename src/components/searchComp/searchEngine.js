import _ from 'lodash'

import Fuse from 'fuse.js'

class SearchEngine {


    static clearStr(str) {
        return str.replace(/<[^>]*>/g, '').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ');
    }


    static  convertSearchDatabase = (value) => {
        const temp = _.cloneDeep(value)
        for (const foo1 of temp) {
            for (const foo1Element of foo1.markdownData.blocks) {

                if (foo1Element.type === 'paragraph') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr(foo1Element.data.text)
                }

                if (foo1Element.type === 'header') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr(foo1Element.data.text)
                }


                if (foo1Element.type === 'list') {


                    const res = []

                    const iterItems = (items) => {
                        for (const item of items) {
                            res.push(item.content)
                            if (item.items.length === 0) continue
                            return iterItems(item.items)
                        }
                    }
                    iterItems(foo1Element.data.items)
                    foo1Element['SearchedText'] = res.join('-').replace(/<[^>]*>/g, '')
                }


                if (foo1Element.type === 'checklist') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr(foo1Element.data.items.map(foo => foo.text).join('-'))

                }


                if (foo1Element.type === 'quote') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr([foo1Element.data.caption, foo1Element.data.text].join('-'))

                }


                if (foo1Element.type === 'delimiter') {
                    foo1Element['SearchedText'] = 'delimiter'
                }


                if (foo1Element.type === 'attaches') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr(foo1Element.data.title)
                    foo1Element.data.file = null
                }

                if (foo1Element.type === 'image') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr(foo1Element.data.caption)
                    foo1Element.data.url = null
                }
                if (foo1Element.type === 'alert') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr(foo1Element.data.message)

                }
                if (foo1Element.type === 'raw') {
                    foo1Element['SearchedText'] = SearchEngine.clearStr(foo1Element.data.html)

                }
                if (foo1Element.type === "table") {
                    const res = []
                    for (const item of foo1Element.data.content) {
                        res.push(...item)
                    }
                    foo1Element['SearchedText'] = SearchEngine.clearStr(res.join('-'))
                }
            }

        }

        return temp

    }



    constructor(data, fuseOptions) {
        this.fuse = new Fuse(SearchEngine.convertSearchDatabase(data), fuseOptions);

        // console.log(fuseOptions, 'fuseOptions')
    }


    search(searchPattern) {
        this.res = this.fuse.search(searchPattern)
        return this.res

    }


    postSearchResult() {
        if (this.res.length === 0) return null
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

export default SearchEngine
