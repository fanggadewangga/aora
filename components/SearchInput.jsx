import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '../constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({initialQuery, placeholder, otherStyles, ...props}) => {

  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || '')
  
  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 
            bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
            <TextInput
                className="text-base mt-1.5 text-white flex-1 font-psemibold"
                value={query}
                placeholder={placeholder}
                placeholderTextColor='#CDCDE0'
                onChangeText={(e) => setQuery(e)}
            />
            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert('Missing query', 'Please input something to search result accross database')
                    }

                    if (pathName.startsWith('/search')) {
                        router.setParams({query})
                    } else {
                        router.push(`/search/${query}`)
                    }

                }}
            >
                <Image
                    source={icons.search}
                    className='w-5 h-5'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
  )
}

export default SearchInput