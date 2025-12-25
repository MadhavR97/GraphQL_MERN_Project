'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', published: false });
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', published: false });

  const { loading, error, data, refetch } = useQuery(GET_MY_POSTS);

  const [createPostMutation] = useMutation(CREATE_POST);
  const [updatePostMutation] = useMutation(UPDATE_POST);
  const [deletePostMutation] = useMutation(DELETE_POST);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading posts...</div>
        </div>
      </DashboardLayout>
    );
  }

  const posts = data?.myPosts || [];

  return (
    <DashboardLayout>
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
            className={showCreateForm
              ? 'px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-md transition-all duration-300 border border-rose-500/20 shadow-sm'
              : 'px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all duration-300 shadow-lg shadow-indigo-500/25'}
          >
            {!showCreateForm && <Plus className="w-4 h-4" />}
            <span className="font-semibold">{showCreateForm ? 'Cancel' : 'Create Post'}</span>
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
                <Button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all duration-300 shadow-lg shadow-indigo-500/25">
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
                  <Button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all duration-300 shadow-lg shadow-indigo-500/25">
                    Update Post
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingPost(null);
                      setEditForm({ title: '', content: '', published: false });
                    }}
                    className="px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-md transition-all duration-300 border border-rose-500/20 shadow-sm"
                  >
                    <span className="font-semibold">Cancel</span>
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
                    <button
                      onClick={() => handleEditClick(post)}
                      className="group flex items-center px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-md transition-all duration-300 ease-out shadow-sm hover:shadow-indigo-500/25 border border-indigo-500/20 hover:border-indigo-500"
                    >
                      <Edit className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                      <span className="text-sm font-semibold tracking-wide">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="group flex items-center px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-md transition-all duration-300 ease-out shadow-sm hover:shadow-rose-500/25 border border-rose-500/20 hover:border-rose-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-semibold tracking-wide">Delete</span>
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{post.content}</p>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${post.published
                    ? 'bg-green-900/30 text-green-400 border border-green-700'
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                    }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
