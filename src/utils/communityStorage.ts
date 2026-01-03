// Community Posts LocalStorage Utility
// Stores user-created posts locally

export interface CommunityPost {
    id: number;
    title: string;
    content: string;
    category: string;
    author: string;
    date: string;
    views: number;
    likes: number;
    comments: number;
    images?: string[];
    isUserPost: boolean;
}

const POSTS_KEY = 'lunaalba_community_posts';
const POST_ID_KEY = 'lunaalba_post_id_counter';

// Get next ID
const getNextId = (): number => {
    const currentId = parseInt(localStorage.getItem(POST_ID_KEY) || '10000');
    const nextId = currentId + 1;
    localStorage.setItem(POST_ID_KEY, nextId.toString());
    return nextId;
};

// Get all user posts
export const getUserPosts = (): CommunityPost[] => {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
};

// Save posts
const savePosts = (posts: CommunityPost[]) => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

// Create new post
export const createPost = (postData: {
    title: string;
    content: string;
    category: string;
    images?: string[];
}): CommunityPost => {
    const posts = getUserPosts();

    const newPost: CommunityPost = {
        id: getNextId(),
        title: postData.title,
        content: postData.content,
        category: postData.category,
        author: '익명',
        date: new Date().toLocaleDateString('ko-KR'),
        views: 0,
        likes: 0,
        comments: 0,
        images: postData.images,
        isUserPost: true,
    };

    posts.unshift(newPost);
    savePosts(posts);

    return newPost;
};

// Get post by ID
export const getPostById = (id: number): CommunityPost | undefined => {
    const posts = getUserPosts();
    return posts.find(p => p.id === id);
};

// Update post views
export const incrementViews = (id: number): void => {
    const posts = getUserPosts();
    const post = posts.find(p => p.id === id);
    if (post) {
        post.views += 1;
        savePosts(posts);
    }
};

// Toggle like
export const toggleLike = (id: number): number => {
    const posts = getUserPosts();
    const post = posts.find(p => p.id === id);
    if (post) {
        // Check if already liked (simple localStorage tracking)
        const likedPosts = JSON.parse(localStorage.getItem('lunaalba_liked_posts') || '[]');
        const isLiked = likedPosts.includes(id);

        if (isLiked) {
            post.likes = Math.max(0, post.likes - 1);
            localStorage.setItem('lunaalba_liked_posts', JSON.stringify(likedPosts.filter((pid: number) => pid !== id)));
        } else {
            post.likes += 1;
            likedPosts.push(id);
            localStorage.setItem('lunaalba_liked_posts', JSON.stringify(likedPosts));
        }
        savePosts(posts);
        return post.likes;
    }
    return 0;
};

// Check if post is liked
export const isPostLiked = (id: number): boolean => {
    const likedPosts = JSON.parse(localStorage.getItem('lunaalba_liked_posts') || '[]');
    return likedPosts.includes(id);
};

// Delete post
export const deletePost = (id: number): boolean => {
    const posts = getUserPosts();
    const filtered = posts.filter(p => p.id !== id);
    if (filtered.length < posts.length) {
        savePosts(filtered);
        return true;
    }
    return false;
};
