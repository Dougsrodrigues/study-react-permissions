import { createMongoAbility } from "@casl/ability";

export type Action = "create" | "update" | "delete" | "read";
export type Subject = "Task";

export type ActionsSubjectAbility = {
  action: Action;
  subject: Subject;
};

export const buildAbility = (abilities: ActionsSubjectAbility[]) => {
  const ability = createMongoAbility<[Action, Subject]>();

  ability.update(abilities);

  return ability;
};
