
const items = [
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



const Fuse = require('fuse.js');
const _ = require('lodash');


const fuseOptions = {
    isCaseSensitive: false,
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
    keys: ['author.name', 'title']}


// Change the pattern
const searchPattern = "Hamilton"


const searchObj = new Fuse(items, fuseOptions)
const res = searchObj.search(searchPattern)





// const fuse = new Fuse(items2, fuseOptions);

// Change the pattern
// const searchPattern = "engsh"


console.log(res.length + '个结果')
console.log(JSON.stringify(res, null, 2));
console.log(res);
