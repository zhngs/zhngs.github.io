import fs from 'fs'
import path, { dirname } from 'path'
import matter from 'gray-matter'
import { getYear } from 'date-fns';

const postsRootDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // 只使用一层的目录
    const postDirs = fs.readdirSync(postsRootDirectory);
    let allPostsData = [];
    for (const dir of postDirs) {
        const fileNames = fs.readdirSync(path.join(postsRootDirectory, dir))
        const dirPostsData = fileNames.map(fileName => {
            // Remove ".md" from file name to get id
            const id = fileName.replace(/\.md$/, '')

            // Read markdown file as string
            const fullPath = path.join(postsRootDirectory, dir, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            const words = fileContents.length

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents)

            // Combine the data with the id
            return {
                id,
                words,
                dir,
                ...matterResult.data
            }
        });
        allPostsData = allPostsData.concat(dirPostsData);
    }

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getSortedPostsDataWithDir(dir) {
    const fileNames = fs.readdirSync(path.join(postsRootDirectory, dir))
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsRootDirectory, dir, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            dir,
            ...matterResult.data
        }
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getSortedPostsDataWithYear(year) {
    const allPosts = getSortedPostsData();
    return allPosts.filter(item => {
        if (item.date.indexOf(year) != -1) {
            return item;
        }
    });
}

export function getPinnedPostsData() {
    let pinnedFiles = [];
    pinnedFiles.push({ filename: "关于我.md", dir: "随笔" })
    pinnedFiles.push({ filename: "关于本站.md", dir: "随笔" })
    const allPostsData = pinnedFiles.map(({ filename, dir }) => {
        // Remove ".md" from file name to get id
        const id = filename.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsRootDirectory, dir, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const words = fileContents.length

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            words,
            dir,
            ...matterResult.data
        }
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getPostsDir() {
    const r = [];
    const postDirs = fs.readdirSync(postsRootDirectory);
    for (const dir of postDirs) {
        const filepath = path.join(postsRootDirectory, dir);
        const fileNames = fs.readdirSync(filepath);
        r.push({ dirname: dir, postnum: fileNames.length });
    }
    return r;
}

export function getPostsDate() {
    const r = {};
    const allPosts = getSortedPostsData();
    for (const post of allPosts) {
        let postDate = new Date(post.date);
        let postYear = getYear(postDate).toString();

        if (postYear in r) {
            r[postYear] = r[postYear] + 1;
        } else {
            r[postYear] = 1;
        }
    }

    const rr = []
    for (let item in r) {
        rr.push({year: item, postnum: r[item]});
    }

    return rr.sort((a, b) => {
        if (a.year< b.year) {
            return 1
        } else {
            return -1
        }
    })
}


export function getAllPostIds() {
    const postDirNames = fs.readdirSync(postsRootDirectory);
    let allPostIds = [];
    for (const dir of postDirNames) {
        allPostIds = allPostIds.concat(getAllPostIdsWithDir(dir));
    }
    return allPostIds
}

export function getAllPostIdsWithDir(postsDirectory) {
    const fileNames = fs.readdirSync(path.join(postsRootDirectory, postsDirectory))
    return fileNames.map(fileName => {
        return {
            params: {
                id: [postsDirectory, fileName.replace(/\.md$/, '')]
            }
        }
    })
}

export function getAllDir() {
    const allDir = fs.readdirSync(postsRootDirectory);
    return allDir.map(dirname => {
        return {
            params: {
                dir: dirname
            }
        }
    })
}

export function getAllDate() {
    const d = getPostsDate();
    return d.map(({year}) => {
        return {
            params: {
                date: year
            }
        }
    })
}

export async function getPostData(postsDirectory, id) {
    const fullPath = path.join(postsRootDirectory, postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const contentMarkdown = matterResult.content;
    const words = contentMarkdown.length;

    // Combine the data with the id and contentHtml
    return {
        id,
        words,
        contentMarkdown,
        ...matterResult.data
    }
}
