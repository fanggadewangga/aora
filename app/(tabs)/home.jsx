import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllVideos, getTrendingVideos } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {

  const { data: videos, reFetch } = useAppWrite(getAllVideos);
  const { data: trendingVideos} = useAppWrite(getTrendingVideos);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const onRefresh = async () => {
    setIsRefreshing(true)
    await reFetch();
    setIsRefreshing(false)
  }

  return (
    <SafeAreaView className='h-full bg-primary'>
      <FlatList
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="flex-row justify-between mb-6 items-start">
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome back,
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {user?.username}
                </Text>
              </View>
              <View className='mt-1.5'>
                <Image
                  source={images.logoSmall}
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </View>
            </View>
            <SearchInput
              placeholder='Search for a video topic'
            />
            <View className='w-full flex-1'>
              <Text className='text-gray-100 text-lg font-psemibold mb-3'>
                Trending Videos
              </Text>
            </View>
            <Trending 
              videos={trendingVideos}
            />
          </View>
        )}
        data={videos}
        keyExtractor={ (item) => item.$id}
        renderItem={({item}) => (
          <VideoCard
            video={item}
          />
        )}
        ListEmptyComponent={ () => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload the video"
          />
        )}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Home