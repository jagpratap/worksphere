import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { SafeUser } from "@/types";

import { PermissionGate } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERMISSIONS } from "@/config/permissions";
import { parseApiError } from "@/utils/error";
import { getInitials } from "@/utils/string";

import type { ProjectDetailResponse } from "../types";

import { useGetUsersQuery, useUpdateProjectMutation } from "../api";

type MemberManagerProps = {
  project: ProjectDetailResponse;
};

export function MemberManager({ project }: MemberManagerProps) {
  const { data: allUsers } = useGetUsersQuery();
  const [updateProject] = useUpdateProjectMutation();
  const [adding, setAdding] = useState(false);

  const currentMemberIds = new Set([project.owner.id, ...project.memberIds]);

  const availableUsers = allUsers?.filter(u => !currentMemberIds.has(u.id)) ?? [];

  const handleAddMember = async (userId: string) => {
    try {
      const newMemberIds = [...project.memberIds, userId];
      await updateProject({ id: project.id, memberIds: newMemberIds }).unwrap();
      setAdding(false);
    }
    catch (err) {
      const { message } = parseApiError(err);
      toast.error(message);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const newMemberIds = project.memberIds.filter(id => id !== userId);
      await updateProject({ id: project.id, memberIds: newMemberIds }).unwrap();
    }
    catch (err) {
      const { message } = parseApiError(err);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-2">
      {/* Owner */}
      <MemberRow user={project.owner} badge="Owner" />

      {/* Members */}
      {project.members.map(member => (
        <div key={member.id} className="flex items-center gap-2">
          <MemberRow user={member} />
          <PermissionGate requires={PERMISSIONS.SPRINTS_MANAGE}>
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemoveMember(member.id)}
            >
              <X className="size-3.5" />
            </Button>
          </PermissionGate>
        </div>
      ))}

      {project.members.length === 0 && (
        <p className="text-xs text-muted-foreground">No members assigned</p>
      )}

      {/* Add member */}
      <PermissionGate requires={PERMISSIONS.SPRINTS_MANAGE}>
        {adding
          ? (
              <Select onValueChange={handleAddMember}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                  {availableUsers.length === 0 && (
                    <SelectItem value="__none" disabled>
                      No users available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )
          : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={() => setAdding(true)}
              >
                <UserPlus className="size-4" />
                Add member
              </Button>
            )}
      </PermissionGate>
    </div>
  );
}

function MemberRow({ user, badge }: { user: SafeUser; badge?: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <Avatar className="size-7">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-xs">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-sm">{user.name}</span>
      {badge && (
        <Badge variant="outline" className="ml-auto text-[10px]">{badge}</Badge>
      )}
    </div>
  );
}
