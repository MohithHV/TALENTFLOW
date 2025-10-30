import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { candidatesApi } from '@/lib/api/candidates';
import { formatDate, formatDateRelative } from '@/lib/utils';
import { ArrowLeft, User, Mail, Phone, Calendar, Clock } from 'lucide-react';
import { CandidateNotes } from './CandidateNotes';
import type { Candidate, CandidateTimeline, CandidateStage } from '@/types';

const STAGE_LABELS: Record<CandidateStage, string> = {
  applied: 'Applied',
  screen: 'Screening',
  tech: 'Technical',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected'
};

const STAGE_COLORS: Record<CandidateStage, string> = {
  applied: 'bg-blue-100 text-blue-800',
  screen: 'bg-yellow-100 text-yellow-800',
  tech: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  hired: 'bg-green-600 text-white',
  rejected: 'bg-red-100 text-red-800'
};

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [timeline, setTimeline] = useState<CandidateTimeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCandidate(id);
      loadTimeline(id);
    }
  }, [id]);

  async function loadCandidate(candidateId: string) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await candidatesApi.getCandidateById(candidateId);
      setCandidate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load candidate');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadTimeline(candidateId: string) {
    try {
      const data = await candidatesApi.getCandidateTimeline(candidateId);
      setTimeline(data);
    } catch (err) {
      console.error('Failed to load timeline:', err);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="text-center py-12 text-muted-foreground">
          Loading candidate profile...
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || 'Candidate not found'}</p>
          <Link to="/candidates">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Candidates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <Link to="/candidates">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-primary" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{candidate.name}</h1>
              <Badge className={STAGE_COLORS[candidate.stage]}>
                {STAGE_LABELS[candidate.stage]}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Applied {formatDate(candidate.appliedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-muted-foreground text-sm">No stage changes yet</p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-primary' : 'bg-muted'
                        }`} />
                        {index < timeline.length - 1 && (
                          <div className="w-px h-full bg-border mt-1" />
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {entry.fromStage && (
                            <>
                              <Badge variant="outline" className="text-xs">
                                {STAGE_LABELS[entry.fromStage]}
                              </Badge>
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}
                          <Badge className={`${STAGE_COLORS[entry.toStage]} text-xs`}>
                            {STAGE_LABELS[entry.toStage]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateRelative(entry.changedAt)}</span>
                        </div>
                        {entry.note && (
                          <p className="text-sm mt-2">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <CandidateNotes candidateId={candidate.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                <p className="text-sm">{candidate.email}</p>
              </div>
              {candidate.phone && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                  <p className="text-sm">{candidate.phone}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Applied</h4>
                <p className="text-sm">{formatDate(candidate.appliedAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                <p className="text-sm">{formatDate(candidate.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {candidate.resume && (
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Download Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
