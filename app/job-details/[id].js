import React, { useCallback, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from '../../components';
import { COLORS, icons, images, SIZES } from '../../constants';
import useFetch from '../../hooks/useFetch';

const tabs = ['About', 'Qualifications', 'Responsibilities'];
const JobDetails = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const router = useRouter();
  const params = useSearchParams();
  const { data, isLoading, error, refetch } = useFetch('job-details', {
    job_id: params.id,
  });

 const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case 'About':
        return <JobAbout info={data[0]?.job_description ?? "No Data Provided"} />;
      case 'Qualifications':
        return (
          <Specifics
            title={'Qualifications'}
            points={data[0].job_highlights?.Qualifications ?? ['No Data Provided']}
          />
        );
      case 'Responsibilities':
        return  <Specifics
        title={'Responsibilities'}
        points={data[0].job_highlights?.Responsibilities ?? ['No Data Provided']}
      />;
      default:
        break;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension='60%'
              handlePress={() => router.goBack()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension='60%' />
          ),
          headerTitle: '',
        }}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size='large' color={COLORS.primary} />
          ) : error ? (
            <Text>something went wrong</Text>
          ) : data.length === 0 ? (
            <Text>no data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                Location={data[0].job_country}
              />
              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        <JobFooter url={data[0]?.job_google_link ?? 'https://careers.google.com/jobs/results'}/>
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
