import { useAssessmentsStore } from '@/stores/assessmentsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SectionEditor } from './SectionEditor';
import { QuestionEditor } from './QuestionEditor';
import { FileText } from 'lucide-react';

export function BuilderCanvas() {
  const { sections, questions } = useAssessmentsStore();

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No sections yet</p>
            <p className="text-sm">Add a section from the sidebar to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const sectionQuestions = questions.filter(q => q.sectionId === section.id);

        return (
          <Card key={section.id}>
            <CardHeader>
              <SectionEditor section={section} />
            </CardHeader>
            <CardContent className="space-y-3">
              {sectionQuestions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No questions in this section yet
                </p>
              ) : (
                sectionQuestions.map((question) => (
                  <QuestionEditor key={question.id} question={question} />
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
