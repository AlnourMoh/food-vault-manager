
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StorageTeamMember } from '@/types';
import TeamMemberTable from './TeamMemberTable';

interface TeamContentProps {
  teamMembers: StorageTeamMember[];
  isLoading: boolean;
  onEditMember: (member: StorageTeamMember) => void;
  onDeleteMember: (member: StorageTeamMember) => void;
}

const TeamContent: React.FC<TeamContentProps> = ({
  teamMembers,
  isLoading,
  onEditMember,
  onDeleteMember
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>أعضاء فريق المخزن</CardTitle>
        <CardDescription>قائمة بجميع أعضاء فريق المخزن وأدوارهم</CardDescription>
      </CardHeader>
      <CardContent>
        <TeamMemberTable 
          teamMembers={teamMembers}
          isLoading={isLoading}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
        />
      </CardContent>
    </Card>
  );
};

export default TeamContent;
