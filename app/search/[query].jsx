import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchVideos } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {

  const { query } = useLocalSearchParams();
  const { data: videos, reFetch } = useAppWrite(() => searchVideos(query));

  console.log(query, videos)

  useEffect(() => {
    reFetch()
  }, [query])


  return (
    <SafeAreaView className='h-full bg-primary'>
      <FlatList
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="flex-row justify-between mb-6 items-start">
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Search result,
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {query}
                </Text>
              </View>
            </View>
            <SearchInput
              initialQuery={query}
              placeholder='Search for a video topic'
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
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search