import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessmentsStore } from '@/stores/assessmentsStore';
import { assessmentsApi } from '@/lib/api/assessments';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BuilderSidebar } from './BuilderSidebar';
import { BuilderCanvas } from './BuilderCanvas';
import { PreviewPane } from './PreviewPane';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';

export function AssessmentBuilder() {
  const { jobId } = useParams<{ jobId: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const {
    assessment,
    sections,
    questions,
    isLoading,
    error,
    setAssessment,
    setLoading,
    setError,
    reset
  } = useAssessmentsStore();

  useEffect(() => {
    if (jobId) {
      loadAssessment(jobId);
    }

    return () => reset();
  }, [jobId]);

  async function loadAssessment(id: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentsApi.getAssessment(id);
      setAssessment(data);
    } catch (err) {
      if (err instanceof Error && err.message === 'Assessment not found') {
        // Create a new assessment structure
        const newAssessment = {
          id: `assessment-${id}`,
          jobId: id,
          title: 'New Assessment',
          description: 'Please complete this assessment',
          sections: [],
          questions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setAssessment(newAssessment);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!jobId) return;

    try {
      setIsSaving(true);
      const assessmentData = {
        ...assessment,
        sections,
        questions,
        updatedAt: new Date().toISOString()
      };

      await assessmentsApi.saveAssessment(jobId, assessmentData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12 text-muted-foreground">
          Loading assessment...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/jobs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Jobs
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Assessment Builder</h1>
                <p className="text-sm text-muted-foreground">
                  {assessment?.title || 'New Assessment'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Builder Layout */}
      <div className="container mx-auto p-4">
        <div className={`grid gap-4 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* Builder Area */}
          <div className="space-y-4">
            <Card className="p-4">
              <BuilderSidebar />
            </Card>
            <BuilderCanvas />
          </div>

          {/* Preview Area */}
          {showPreview && (
            <div className="lg:sticky lg:top-4 lg:self-start">
              <PreviewPane />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
