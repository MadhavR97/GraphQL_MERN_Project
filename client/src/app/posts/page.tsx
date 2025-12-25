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
  Trash2,
  UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Manage Content</h1>
            <p className="text-muted-foreground text-lg italic">"A clean space for your creative thoughts."</p>
          </div>
          <Button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              if (showCreateForm) {
                setNewPost({ title: '', content: '', published: false });
              }
            }}
            className={cn(
              "h-12 px-8 rounded-2xl font-bold transition-all duration-500 flex items-center shadow-lg",
              showCreateForm
                ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20"
                : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-primary/20"
            )}
          >
            {showCreateForm ? 'Discard Idea' : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                New Draft
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 content-start">
        {/* Form Section */}
        <div className={cn(
          "lg:col-span-1 transition-all duration-500",
          (!showCreateForm && !editingPost) && "hidden lg:block lg:opacity-50 lg:grayscale lg:pointer-events-none"
        )}>
          {(showCreateForm || editingPost) ? (
            <Card className="bg-card border-border rounded-3xl overflow-hidden sticky top-24 shadow-2xl shadow-black/20">
              <CardHeader className="bg-secondary/30 pb-4">
                <CardTitle className="text-xl font-bold text-foreground">
                  {editingPost ? 'Refine Post' : 'Capture Thought'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground ml-1">Title</label>
                    <Input
                      value={editingPost ? editForm.title : newPost.title}
                      onChange={(e) => editingPost
                        ? setEditForm({ ...editForm, title: e.target.value })
                        : setNewPost({ ...newPost, title: e.target.value })}
                      className="h-12 bg-secondary/50 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="What's on your mind?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground ml-1">Content</label>
                    <textarea
                      value={editingPost ? editForm.content : newPost.content}
                      onChange={(e) => editingPost
                        ? setEditForm({ ...editForm, content: e.target.value })
                        : setNewPost({ ...newPost, content: e.target.value })}
                      className="w-full min-h-[200px] p-4 bg-secondary/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none"
                      placeholder="Let your ideas flow..."
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-2xl border border-border/50 group cursor-pointer"
                    onClick={() => editingPost
                      ? setEditForm({ ...editForm, published: !editForm.published })
                      : setNewPost({ ...newPost, published: !newPost.published })}>
                    <Checkbox
                      checked={editingPost ? editForm.published : newPost.published}
                      className="w-5 h-5 rounded-md border-border data-[state=checked]:bg-primary"
                    />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      Make this visible to everyone
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/10">
                      {editingPost ? 'Save Changes' : 'Publish Now'}
                    </Button>
                    {editingPost && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditingPost(null)}
                        className="h-12 rounded-xl px-4 text-muted-foreground"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-3xl h-[400px]">
              <div className="p-4 bg-secondary/50 rounded-full mb-4">
                <Edit className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground font-medium text-center">Select "New Draft" to begin creating something amazing.</p>
            </div>
          )}
        </div>

        {/* Posts List */}
        <div className="lg:col-span-2 space-y-6">
          {posts.length === 0 ? (
            <div className="p-20 text-center bg-card border border-border rounded-3xl">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-muted-foreground/20" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Content Yet</h3>
              <p className="text-muted-foreground">Your creative journey starts with a single post.</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <Card key={post.id} className="group bg-card border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <CardHeader className="pb-3 pt-6 px-8">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                          post.published
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {post.published ? 'Live' : 'Draft'}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="p-3 bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20 shadow-sm"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-3 bg-secondary/50 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all border border-transparent hover:border-rose-500/20 shadow-sm"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center pt-6 border-t border-border/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <UserIcon className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground italic">{post.author.username}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
