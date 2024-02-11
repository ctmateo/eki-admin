import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';
import { FlowType, Gender, PathSection, StateAccount, StateFlow, TypeContent } from '../API.service';

export type GetFlowCompanyQuery = {
  __typename: "FlowCompany";
  id: string;
  companyID: string;
  company: {
    __typename: "CompanyData";
    id: string;
    author?: string | null;
    nameCompany?: string | null;
    nit?: string | null;
    legalName?: string | null;
    legalSurname?: string | null;
    legalDocument?: DocumentType | null;
    legalDocumentNumber?: string | null;
    logoCompany?: string | null;
    economicSectorID?: string | null;
    economicSector?: {
      __typename: "Classifiers";
      id: string;
      name?: string | null;
      isAvalible?: boolean | null;
      category: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    userID: string;
    user: {
      __typename: "User";
      id: string;
      author?: string | null;
      birthday?: string | null;
      isPolicies?: boolean | null;
      hasCharacterization?: boolean | null;
      email: string;
      gender?: Gender | null;
      lastname?: string | null;
      name: string;
      phone?: string | null;
      updatedAt: string;
      createdAt: string;
      owner?: string | null;
    };
    dateUnsubcribe: string;
    limitUsers?: number | null;
    activeUsers?: number | null;
    updatedAt: string;
    createdAt: string;
    owner?: string | null;
  };
  pathID?: string | null;
  learningPath: {
    __typename: "LearningPath";
    id: string;
    colorPath?: string | null;
    keyImagePresentation?: string | null;
    name?: string | null;
    longDescriptionPath?: string | null;
    descriptionPath?: string | null;
    countCoursesByPath?: number | null;
    tags?: {
      __typename: "ModelPathByTagsConnection";
      items: Array<{
        __typename: "PathByTags";
        id: string;
        tag?: {
          __typename: "Tag";
          id: string;
          name?: string | null;
          photoKey?: string | null;
          isAvalible?: boolean | null;
          updatedAt?: string | null;
          createdAt?: string | null;
        } | null;
        pathID: string;
        createdAt?: string | null;
        updatedAt?: string | null;
        pathByTagsTagId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    courseFromPath?: {
      __typename: "ModelCourseFromPathConnection";
      items: Array<{
        __typename: "CourseFromPath";
        id: string;
        learningPathId: string;
        courseID?: string | null;
        course?: {
          __typename: "Course";
          id: string;
          colorIcon?: string | null;
          countContentByCourse?: number | null;
          countModulesByCourse?: number | null;
          descriptionCourse?: string | null;
          goalCourse?: string | null;
          keyImagePresentation?: string | null;
          keyVideoPresentation?: string | null;
          keyIcon?: string | null;
          longDescriptionCourse?: string | null;
          name?: string | null;
          receiver?: string | null;
          sortIndex?: number | null;
          modules?: {
            __typename: "ModelModuleConnection";
            items: Array<{
              __typename: "Module";
              id: string;
              description?: string | null;
              content?: {
                __typename: "ModelContentModuleConnection";
                items: Array<{
                  __typename: "ContentModule";
                  id: string;
                  isPublish?: boolean | null;
                  sortIndex: number;
                  titleContent?: string | null;
                  typeContent: TypeContent;
                  nextContentID?: string | null;
                  prevContentID?: string | null;
                } | null>;
                nextToken?: string | null;
              } | null;
              countClassByModule?: number | null;
              nameModule?: string | null;
              sortIndex?: number | null;
              courseModulesId: string;
              updatedAt?: string | null;
              createdAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          updatedAt?: string | null;
          createdAt?: string | null;
        } | null;
        pathSection?: PathSection | null;
        sortIndex?: number | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    updatedAt?: string | null;
    createdAt?: string | null;
  };
  flowConversation?: {
    __typename: "ModelFlowConversationConnection";
    items: Array<{
      __typename: "FlowConversation";
      id: string;
      stateFlow: StateFlow;
      flowType: FlowType;
      collaboratorID: string;
      collaboratorData: {
        __typename: "CollaboratorData";
        id: string;
        author?: string | null;
        fullName?: string | null;
        positionInTheCompany?: string | null;
        stateCollaborator: StateAccount;
        dateActive?: string | null;
        coursesStarted?: number | null;
        completedCoursesFinished?: number | null;
        companyID: string;
        company: {
          __typename: "CompanyData";
          id: string;
          author?: string | null;
          nameCompany?: string | null;
          nit?: string | null;
          legalName?: string | null;
          legalSurname?: string | null;
          legalDocument?: DocumentType | null;
          legalDocumentNumber?: string | null;
          logoCompany?: string | null;
          economicSectorID?: string | null;
          userID: string;
          dateUnsubcribe: string;
          limitUsers?: number | null;
          activeUsers?: number | null;
          updatedAt: string;
          createdAt: string;
          owner?: string | null;
        };
        userID: string;
        user: {
          __typename: "User";
          id: string;
          author?: string | null;
          birthday?: string | null;
          isPolicies?: boolean | null;
          hasCharacterization?: boolean | null;
          email: string;
          gender?: Gender | null;
          lastname?: string | null;
          name: string;
          phone?: string | null;
          updatedAt: string;
          createdAt: string;
          owner?: string | null;
        };
        updatedAt: string;
        createdAt: string;
        owner?: string | null;
      };
      pathID?: string | null;
      currentCourseID?: string | null;
      nextCourseID?: string | null;
      currentModuleID?: string | null;
      nextModuleID?: string | null;
      currentContentID?: string | null;
      nextContentID?: string | null;
      totalContent?: number | null;
      flowCompanyID: string;
      flowCompany?: {
        __typename: "FlowCompany";
        id: string;
        companyID: string;
        company: {
          __typename: "CompanyData";
          id: string;
          author?: string | null;
          nameCompany?: string | null;
          nit?: string | null;
          legalName?: string | null;
          legalSurname?: string | null;
          legalDocument?: DocumentType | null;
          legalDocumentNumber?: string | null;
          logoCompany?: string | null;
          economicSectorID?: string | null;
          userID: string;
          dateUnsubcribe: string;
          limitUsers?: number | null;
          activeUsers?: number | null;
          updatedAt: string;
          createdAt: string;
          owner?: string | null;
        };
        pathID?: string | null;
        learningPath: {
          __typename: "LearningPath";
          id: string;
          colorPath?: string | null;
          keyImagePresentation?: string | null;
          name?: string | null;
          longDescriptionPath?: string | null;
          descriptionPath?: string | null;
          countCoursesByPath?: number | null;
          updatedAt?: string | null;
          createdAt?: string | null;
        };
        flowConversation?: {
          __typename: "ModelFlowConversationConnection";
          nextToken?: string | null;
        } | null;
        inscribed: number;
        completed: number;
        deserts: number;
        updatedAt?: string | null;
        createdAt?: string | null;
      } | null;
      updatedAt?: string | null;
      createdAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  inscribed: number;
  completed: number;
  deserts: number;
  updatedAt?: string | null;
  createdAt?: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class FlowCompanyService {

  async GetFlowCompany(id: string): Promise<GetFlowCompanyQuery> {
    const statement = `query GetFlowCompany($id: ID!) {
        getFlowCompany(id: $id) {
          __typename
          id
          companyID
          pathID
          learningPath {
            __typename
            id
            name
            countCoursesByPath
            courseFromPath {
              __typename
              items {
                __typename
                id
                learningPathId
                courseID
                course {
                  __typename
                  id
                  colorIcon
                  countContentByCourse
                  countModulesByCourse
                  descriptionCourse
                  goalCourse
                  keyImagePresentation
                  keyVideoPresentation
                  keyIcon
                  longDescriptionCourse
                  name
                  receiver
                  sortIndex
                  modules {
                    __typename
                    items {
                      __typename
                      id
                      description
                      content {
                        __typename
                        items {
                          __typename
                          id
                          moduleContentId
                          isPublish
                          sortIndex
                          titleContent
                          typeContent
                          nextContentID
                          prevContentID
                        }
                        nextToken
                      }
                      countClassByModule
                      nameModule
                      sortIndex
                      courseModulesId
                      updatedAt
                      createdAt
                    }
                    nextToken
                  }
                  updatedAt
                  createdAt
                }
                pathSection
                sortIndex
                createdAt
                updatedAt
              }
              nextToken
            }
            updatedAt
            createdAt
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetFlowCompanyQuery>response.data.getFlowCompany;
  }
}
