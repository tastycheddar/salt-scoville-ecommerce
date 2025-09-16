
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Gift, Clock, User, Video } from 'lucide-react';
import { RecipeSubmission, SubmissionReview, SubmissionStats } from '@/types/recipe-submissions';

import { toast } from 'sonner';


const AdminSubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<RecipeSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<RecipeSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rewardType, setRewardType] = useState<'product' | 'gift_card' | 'discount'>('product');
  const [rewardValue, setRewardValue] = useState(25);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SubmissionStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalRewards: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/recipe-submissions', {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch submissions');

      const submissions = await response.json();
      setSubmissions(submissions);
      
      // Calculate stats
      const pending = submissions.filter(s => s.status === 'pending').length;
      const approved = submissions.filter(s => s.status === 'approved').length;
      const rejected = submissions.filter(s => s.status === 'rejected').length;
      const totalRewards = submissions.reduce((sum, s) => sum + (s.reward_value || 0), 0);
      
      setStats({
        pending,
        approved,
        rejected,
        totalRewards,
        thisMonth: submissions.length
      });
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/admin/recipe-submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          admin_notes: reviewNotes,
          reward_type: rewardType,
          reward_value: rewardValue
        }),
      });

      if (!response.ok) throw new Error('Failed to approve submission');

      toast.success('Submission approved successfully!');
      setSelectedSubmission(null);
      setReviewNotes('');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to approve submission');
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('recipe_submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          admin_notes: reviewNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Submission rejected');
      setSelectedSubmission(null);
      setReviewNotes('');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to reject submission');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${stats.totalRewards}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.thisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{submission.title}</h3>
                    <Badge className={`${getStatusColor(submission.status)} text-white border-0`}>
                      {submission.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      Heat: {submission.heat_level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      User ID: {submission.user_id || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(submission.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4" />
                      ${submission.reward_value || 0} reward
                    </div>
                  </div>

                   <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(submission.featured_salts) ? 
                      submission.featured_salts.map((salt, index) => (
                        <Badge key={index} className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          {String(salt)}
                        </Badge>
                      )) : 
                      <span className="text-white/50 text-sm">No featured salts</span>
                    }
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedSubmission(submission)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                  {submission.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(submission.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReject(submission.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <Dialog open onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                Review Submission: {selectedSubmission?.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Video Preview */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70">Video Preview</p>
                  <p className="text-white/50 text-sm">{selectedSubmission?.video_url}</p>
                </div>
              </div>

              {/* Submission Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium">User</label>
                  <p className="text-white/80">{selectedSubmission?.user_id || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-white font-medium">Heat Level</label>
                  <p className="text-white/80">{selectedSubmission?.heat_level || 0}/5</p>
                </div>
              </div>

              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium">Review Notes</label>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes about this submission..."
                    className="bg-white/10 border-white/20 text-white"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium">Reward Type</label>
                     <Select 
                       value={rewardType} 
                       onValueChange={(value: 'product' | 'gift_card' | 'discount') => setRewardType(value)}
                     >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Free Product</SelectItem>
                        <SelectItem value="gift_card">Gift Card</SelectItem>
                        <SelectItem value="discount">Discount Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-white font-medium">Reward Value ($)</label>
                    <Input
                      type="number"
                      value={rewardValue}
                      onChange={(e) => setRewardValue(parseInt(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
                <Button
                  onClick={() => setSelectedSubmission(null)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
                {selectedSubmission && (
                  <>
                    <Button
                      onClick={() => handleReject(selectedSubmission.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedSubmission.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve & Send Reward
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminSubmissionsManager;
