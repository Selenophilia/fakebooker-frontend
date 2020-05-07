import React, { useState } from "react";
import ContentLoader from "react-content-loader";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useForm } from "react-hook-form";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Link, useParams } from "react-router-dom";
import {
  AboutInfoContainer,
  AboutContainer,
  AboutSidebar,
  AboutHeading,
  Overview,
  WorkAndEducation,
  ContactAndBasicInfo,
  AboutBodyContainer,
  WorkplaceContainer,
  WorkplaceHeading,
  WorkplaceAction,
  WorkplaceSpan,
  SchoolContainer,
  SchoolHeading,
  SchoolAction,
  SchoolSpan,
  School,
  WorkPlace,
  AboutSkeleton,
  WorkPlaceBody,
  SchoolBody,
  SettingsContainer,
  WorkplaceActionContainer,
  WorkplaceInput,
  SchoolActionContainer,
  SchoolInput,
  CancelButton,
  SaveButton,
  Footer,
} from "./AboutWorkAndEducation.styles";
import {
  ADD_WORKPLACE,
  ADD_SCHOOL,
  LOAD_USER,
  DELETE_WORKPLACE,
  DELETE_SCHOOL,
  LOAD_FROM_URL_USER,
} from "../../utils/queries";
import { ReactComponent as PlusIcon } from "../../assets/icons/add-circle-outline.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

const AboutPageWorkAndEducation = () => {
  const { register, getValues, handleSubmit } = useForm();
  const [addWorkplace, setAddWorkplace] = useState(false);
  const [addSchool, setAddSchool] = useState(false);

  const [saveWorkplace, { loading: saveWorkplaceLoading }] = useMutation(
    ADD_WORKPLACE,
    {
      variables: {
        body: getValues("workplace"),
      },
    }
  );

  const [deleteWorkplace, { loading: deleteWorkplaceLoading }] = useMutation(
    DELETE_WORKPLACE
  );

  const [saveSchool, { loading: saveSchoolLoading }] = useMutation(ADD_SCHOOL, {
    variables: {
      body: getValues("school"),
    },
  });

  const [deleteSchool, { loading: deleteSchoolLoading }] = useMutation(
    DELETE_SCHOOL
  );

  const deleteWorkplaceCb = async () => {
    await deleteWorkplace();
    setAddWorkplace(false);
  };

  const deleteSchoolCb = () => {
    deleteSchool();
    setAddSchool(false);
  };

  const { data: userData, loading: authLoading } = useQuery(LOAD_USER);
  const { username } = useParams();

  // skip this when on auth page
  const { data: profileData, loading: profileLoading } = useQuery(
    LOAD_FROM_URL_USER,
    {
      variables: {
        username,
      },
    }
  );

  /* eslint-disable consistent-return */
  const readOnly = () => {
    if (userData) {
      if (userData.loadUser.username !== username) {
        return true;
        // eslint-disable-next-line no-else-return
      } else {
        return false;
      }
    }
  };

  const onSubmitWorkplace = async () => {
    await saveWorkplace();
    setAddWorkplace(false);
  };

  const onSubmitSchool = async () => {
    await saveSchool();
    setAddSchool(false);
  };

  return (
    <AboutInfoContainer>
      <AboutContainer>
        {!authLoading && !profileLoading ? (
          <>
            <AboutSidebar>
              <AboutHeading>About</AboutHeading>
              <Link to="about_overview">
                <Overview>Overview</Overview>
              </Link>
              <Link to="about_work_and_education">
                <WorkAndEducation>Work and Education</WorkAndEducation>
              </Link>
              <Link to="about_contact_and_basic_info">
                <ContactAndBasicInfo>
                  Contact and Basic Info
                </ContactAndBasicInfo>
              </Link>
            </AboutSidebar>
            {readOnly() ? (
              <AboutBodyContainer>
                <WorkplaceContainer>
                  <WorkplaceHeading>Work</WorkplaceHeading>
                  {profileData.loadFromUrlUser.workPlace && (
                    <WorkPlace>
                      <WorkPlaceBody data-testid="workplace">
                        Works at{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {profileData.loadFromUrlUser.workPlace}
                        </span>
                      </WorkPlaceBody>
                    </WorkPlace>
                  )}
                </WorkplaceContainer>
                <SchoolContainer>
                  <SchoolHeading>High School</SchoolHeading>
                  {profileData.loadFromUrlUser.school && (
                    <School>
                      <SchoolBody>
                        Studies at{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {profileData.loadFromUrlUser.school}
                        </span>
                      </SchoolBody>
                    </School>
                  )}
                </SchoolContainer>
              </AboutBodyContainer>
            ) : (
              <AboutBodyContainer>
                <WorkplaceContainer>
                  <WorkplaceHeading>Work</WorkplaceHeading>
                  {addWorkplace && (
                    <WorkplaceActionContainer
                      onSubmit={handleSubmit(onSubmitWorkplace)}
                    >
                      <WorkplaceInput
                        type="text"
                        name="workplace"
                        placeholder="Company"
                        ref={register}
                      />
                      {saveWorkplaceLoading && (
                        <Loader
                          type="TailSpin"
                          color="#1876f2"
                          style={{
                            marginTop: "15px",
                            position: "absolute",
                            top: "15px",
                            right: "16px",
                          }}
                          height={20}
                          width={20}
                        />
                      )}
                      <Footer>
                        <CancelButton onClick={() => setAddWorkplace(false)}>
                          Cancel
                        </CancelButton>
                        <SaveButton htmlType="submit">Save</SaveButton>
                      </Footer>
                    </WorkplaceActionContainer>
                  )}
                  {!addWorkplace && !userData.loadUser.workPlace && (
                    <WorkplaceAction onClick={() => setAddWorkplace(true)}>
                      <PlusIcon width={30} height={30} />
                      <WorkplaceSpan>Add a workplace</WorkplaceSpan>
                    </WorkplaceAction>
                  )}
                  {userData.loadUser.workPlace && (
                    <WorkPlace>
                      <WorkPlaceBody data-testid="workplace">
                        Works at{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {userData.loadUser.workPlace}
                        </span>
                      </WorkPlaceBody>
                      <SettingsContainer onClick={deleteWorkplaceCb}>
                        {!deleteWorkplaceLoading ? (
                          <CloseIcon width={20} height={20} />
                        ) : (
                          <Loader
                            type="TailSpin"
                            color="#050505"
                            height={20}
                            width={20}
                          />
                        )}
                      </SettingsContainer>
                    </WorkPlace>
                  )}
                </WorkplaceContainer>
                <SchoolContainer>
                  <SchoolHeading>High School</SchoolHeading>
                  {addSchool && (
                    <SchoolActionContainer
                      onSubmit={handleSubmit(onSubmitSchool)}
                    >
                      <SchoolInput
                        type="text"
                        placeholder="School"
                        name="school"
                        ref={register}
                      />
                      {saveSchoolLoading && (
                        <Loader
                          type="TailSpin"
                          color="#1876f2"
                          style={{
                            marginTop: "15px",
                            position: "absolute",
                            top: "15px",
                            right: "16px",
                          }}
                          height={20}
                          width={20}
                        />
                      )}
                      <Footer>
                        <CancelButton onClick={() => setAddSchool(false)}>
                          Cancel
                        </CancelButton>
                        <SaveButton type="link" htmlType="submit">
                          Save
                        </SaveButton>
                      </Footer>
                    </SchoolActionContainer>
                  )}
                  {!addSchool && !userData.loadUser.school && (
                    <SchoolAction onClick={() => setAddSchool(true)}>
                      <PlusIcon width={30} height={30} />
                      <SchoolSpan>Add a high school</SchoolSpan>
                    </SchoolAction>
                  )}
                  {userData.loadUser.school && (
                    <School>
                      <SchoolBody>
                        Studies at{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {userData.loadUser.school}
                        </span>
                      </SchoolBody>
                      <SettingsContainer onClick={deleteSchoolCb}>
                        {!deleteSchoolLoading ? (
                          <CloseIcon width={20} height={20} />
                        ) : (
                          <Loader
                            type="TailSpin"
                            color="#050505"
                            height={20}
                            width={20}
                          />
                        )}
                      </SettingsContainer>
                    </School>
                  )}
                </SchoolContainer>
              </AboutBodyContainer>
            )}
          </>
        ) : (
          <AboutSkeleton>
            <ContentLoader
              speed={1}
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="20" y="20" rx="3" ry="6" width="100" height="21" />
              <rect x="21" y="60" rx="3" ry="6" width="304" height="15" />
              <rect x="21" y="90" rx="0" ry="6" width="303" height="15" />
              <rect x="21" y="120" rx="0" ry="6" width="303" height="15" />
            </ContentLoader>
          </AboutSkeleton>
        )}
      </AboutContainer>
    </AboutInfoContainer>
  );
};

export default AboutPageWorkAndEducation;
