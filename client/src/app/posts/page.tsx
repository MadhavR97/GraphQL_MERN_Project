'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { 
  UserIcon, 
  MenuIcon, 
  HomeIcon, 
  SettingsIcon, 
  LogOutIcon, 
  BarChart3, 
  Users, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
      id
      title
      content
      published
      createdAt
      author {
        username
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      published
      createdAt
      author {
        username
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String, $published: Boolean) {
    updatePost(id: $id, title: $title, content: $content, published: $published) {
      id
      title
      content
      published
      createdAt
      author {
        username
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export default function PostsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', published: false });
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', published: false });
  
  const { loading, error, data, refetch } = useQuery(GET_MY_POSTS);
  
  const [createPostMutation] = useMutation(CREATE_POST);
  const [updatePostMutation] = useMutation(UPDATE_POST);
  const [deletePostMutation] = useMutation(DELETE_POST);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Handle refetch after mutations
  useEffect(() => {
    if (data) {
      // Posts are automatically updated when using Apollo Client
    }
  }, [data]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createPostMutation({
        variables: {
          title: newPost.title,
          content: newPost.content
        }
      });
      
      if (data) {
        refetch(); // Refetch to update the list
        setNewPost({ title: '', content: '', published: false });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await updatePostMutation({
        variables: {
          id: editingPost.id,
          title: editForm.title,
          content: editForm.content,
          published: editForm.published
        }
      });
      
      if (data) {
        refetch(); // Refetch to update the list
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation({
          variables: {
            id
          }
        });
        
        refetch(); // Refetch to update the list
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEditClick = (post: any) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      content: post.content,
      published: post.published
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading posts...</div>
      </div>
    );
  }

  const posts = data?.myPosts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 w-full">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 md:hidden"
            >
              <MenuIcon className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Posts</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300 hidden md:block">
              {isClient ? currentTime : '00:00'}
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-6 h-6 text-gray-300" />
              <span className="text-gray-300 hidden md:block">User</span>
            </div>
            <Button
              onClick={handleLogout}
              className="py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex items-center"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - collapsible on desktop, overlay on mobile */}
        <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900/90 backdrop-blur-lg z-40 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0'} md:static md:translate-x-0 md:h-screen`}>
          <div className="p-3">
            {/* Sidebar toggle button for desktop */}
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-gray-300 ${sidebarOpen ? 'mr-0' : 'mr-3'}`}
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {sidebarOpen && (
              <nav className="mt-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleNavigation('/')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation('/analytics')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Analytics</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation('/users')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <Users className="w-5 h-5" />
                      <span>Users</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation('/posts')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white bg-gray-800/50"
                    >
                      <Edit className="w-5 h-5" />
                      <span>Posts</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation('/settings')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {/* Collapsed sidebar icons for when sidebar is minimized */}
            {!sidebarOpen && (
              <nav className="mt-4">
                <ul className="space-y-4">
                  <li className="flex justify-center">
                    <button
                      onClick={() => handleNavigation('/')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Dashboard"
                    >
                      <HomeIcon className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Profile"
                    >
                      <UserIcon className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button
                      onClick={() => handleNavigation('/analytics')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Analytics"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button
                      onClick={() => handleNavigation('/users')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Users"
                    >
                      <Users className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button
                      onClick={() => handleNavigation('/posts')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Posts"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button
                      onClick={() => handleNavigation('/settings')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Settings"
                    >
                      <SettingsIcon className="w-5 h-5" />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className={`flex-1 p-6 transition-all duration-300`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Manage Posts</h1>
                  <p className="text-gray-400">Create, edit, and delete your posts</p>
                </div>
                <Button
                  onClick={() => {
                    setShowCreateForm(!showCreateForm);
                    if (showCreateForm) {
                      setNewPost({ title: '', content: '', published: false });
                    }
                  }}
                  className={showCreateForm ? 'py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex items-center' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                >
                  {!showCreateForm && <Plus className="w-4 h-4" />}
                  <span className="font-medium">{showCreateForm ? 'Cancel' : 'Create Post'}</span>
                </Button>
              </div>
            </div>

            {/* Create Post Form */}
            {showCreateForm && (
              <Card className="mb-8 bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePost}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                          Title
                        </label>
                        <Input
                          id="title"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Enter post title"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                          Content
                        </label>
                        <textarea
                          id="content"
                          value={newPost.content}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({ ...newPost, content: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white min-h-[150px] p-3 rounded-md w-full"
                          placeholder="Enter post content"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="published"
                          checked={newPost.published}
                          onCheckedChange={(checked) => setNewPost({ ...newPost, published: Boolean(checked) })}
                          className="border-gray-600 data-[state=checked]:bg-indigo-600"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-gray-300">
                          Published
                        </label>
                      </div>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Create Post
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Edit Post Form */}
            {editingPost && (
              <Card className="mb-8 bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Edit Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePost}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">
                          Title
                        </label>
                        <Input
                          id="edit-title"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Enter post title"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-content" className="block text-sm font-medium text-gray-300 mb-1">
                          Content
                        </label>
                        <textarea
                          id="edit-content"
                          value={editForm.content}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({ ...editForm, content: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white min-h-[150px] p-3 rounded-md w-full"
                          placeholder="Enter post content"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-published"
                          checked={editForm.published}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, published: Boolean(checked) })}
                          className="border-gray-600 data-[state=checked]:bg-indigo-600"
                        />
                        <label htmlFor="edit-published" className="text-sm font-medium text-gray-300">
                          Published
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          Update Post
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(null);
                            setEditForm({ title: '', content: '', published: false });
                          }}
                          className="py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                        >
                          <span className="font-medium">Cancel</span>
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-400">No posts yet. Create your first post!</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post: any) => (
                  <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{post.title}</CardTitle>
                          <p className="text-gray-400 text-sm mt-1">
                            By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(post)}
                            className="border-gray-600 text-white hover:bg-gray-700 flex items-center px-3 py-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="font-medium">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600/20 flex items-center px-3 py-1"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span className="font-medium">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{post.content}</p>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}