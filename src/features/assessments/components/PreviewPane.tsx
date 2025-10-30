import { useAssessmentsStore } from '@/stores/assessmentsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AssessmentForm } from './AssessmentForm';
import { Eye } from 'lucide-react';

export function PreviewPane() {
  const { assessment, sections, questions } = useAssessmentsStore();

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Live Preview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This is how candidates will see the assessment
        </p>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Add sections and questions to see the preview</p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <AssessmentForm
              assessment={assessment}
              sections={sections}
              questions={questions}
              isPreview={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
