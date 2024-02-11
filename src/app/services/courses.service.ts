import { Injectable } from '@angular/core';
import { GetCourseQuery, ListCoursesQuery, ModelCourseFilterInput } from '../API.service';
import { API, graphqlOperation } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  async ListCourses(
    filter?: ModelCourseFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListCoursesQuery> {
    const statement = `query ListCourses($filter: ModelCourseFilterInput, $limit: Int, $nextToken: String) {
        listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
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
                countClassByModule
                nameModule
                sortIndex
                courseModulesId
              }
              nextToken
            }
            teachers {
              __typename
              items {
                __typename
                id
                courseID
                courseByTeachersTeacherId
              }
              nextToken
            }
            requirements {
              __typename
              items {
                __typename
                id
                requirement
                courseID
                sortIndex
              }
              nextToken
            }
            tags {
              __typename
              items {
                __typename
                id
                courseID
                courseByTagsTagId
              }
              nextToken
            }
            updatedAt
            createdAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListCoursesQuery>response.data.listCourses;
  }

  async GetCourse(id: string): Promise<GetCourseQuery> {
    const statement = `query GetCourse($id: ID!) {
        getCourse(id: $id) {
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
                nextToken
              }
              countClassByModule
              nameModule
              sortIndex
              courseModulesId
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
                updatedAt
                createdAt
              }
              
            }
            nextToken
          }
          teachers {
            __typename
            items {
              __typename
              id
              teacher {
                __typename
                id
                author
                fullName
                descriptionProfile
                descriptionTeaching
                keyPhoto
                keyVideo
                userID
                updatedAt
                createdAt
                owner
              }
              courseID
             
              courseByTeachersTeacherId
            }
            nextToken
          }
          requirements {
            __typename
            items {
              __typename
              id
              requirement
              courseID
              sortIndex
             
            }
            nextToken
          }
          tags {
            __typename
            items {
              __typename
              id
              tag {
                __typename
                id
                name
                photoKey
                isAvalible
                createdAt
                updatedAt
              }
              courseID
              courseByTagsTagId
            }
            nextToken
          }
          updatedAt
          createdAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetCourseQuery>response.data.getCourse;
  }
}
