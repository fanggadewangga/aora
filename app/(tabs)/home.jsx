import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'

const Home = () => {

  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = async () => {
    setIsRefreshing(true)
    // recall new videos
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
                  Fangga
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
            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg font-psemibold mb-3'>
                Latest Videos
              </Text>
            </View>
            <Trending 
              posts={[{id:1}, {id:2}, {id:3}] ?? []}
            />
          </View>
        )}
        data={[
          {
            id:1
          },
          {
            id:2
          },
          {
            id:2
          }
        ]}
        keyExtractor={ (item) => item.$id}
        renderItem={({item}) => (
          <Text className="text-3xl text-white">
            {item.id}
          </Text>
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