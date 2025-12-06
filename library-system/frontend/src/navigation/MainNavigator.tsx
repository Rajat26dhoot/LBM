import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BooksScreen } from '../screens/books/BooksScreen';
import { BookDetailScreen } from '../screens/books/BookDetailScreen';
import { CreateBookScreen } from '../screens/books/CreateBookScreen';
import { EditBookScreen } from '../screens/books/EditBookScreen';
import { AuthorsScreen } from '../screens/authors/AuthorsScreen';
import { AuthorDetailScreen } from '../screens/authors/AuthorDetailScreen';
import { CreateAuthorScreen } from '../screens/authors/CreateAuthorScreen';
import { EditAuthorScreen } from '../screens/authors/EditAuthorScreen';
import { UsersScreen } from '../screens/users/UsersScreen';
import { BorrowedBooksScreen } from '../screens/borrowed/BorrowedBooksScreen';
import { BorrowBookScreen } from '../screens/borrowed/BorrowBookScreen';
import { useAuth } from '../context/AuthContext';
import {
  BooksStackParamList,
  AuthorsStackParamList,
  BorrowedStackParamList,
  UsersStackParamList,
} from '../types';

import {
  BookOpen,
  PenSquare,
  Bookmark,
  Users,
  LogOut,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const BooksStack = createNativeStackNavigator<BooksStackParamList>();
const AuthorsStack = createNativeStackNavigator<AuthorsStackParamList>();
const BorrowedStack = createNativeStackNavigator<BorrowedStackParamList>();
const UsersStack = createNativeStackNavigator<UsersStackParamList>();

const PURPLE = '#7B61FF';
const INACTIVE = '#A7A0C8';


// BOOK STACK
const BooksStackScreen = () => (
  <BooksStack.Navigator
    screenOptions={{ headerShown: false }}
  >
    <BooksStack.Screen name="BooksList" component={BooksScreen} />
    <BooksStack.Screen name="BookDetail" component={BookDetailScreen} />
    <BooksStack.Screen name="CreateBook" component={CreateBookScreen} />
    <BooksStack.Screen name="EditBook" component={EditBookScreen} />
    <BooksStack.Screen name="BorrowBook" component={BorrowBookScreen} />
  </BooksStack.Navigator>
);


// AUTHOR STACK
const AuthorsStackScreen = () => (
  <AuthorsStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthorsStack.Screen name="AuthorsList" component={AuthorsScreen} />
    <AuthorsStack.Screen name="AuthorDetail" component={AuthorDetailScreen} />
    <AuthorsStack.Screen name="CreateAuthor" component={CreateAuthorScreen} />
    <AuthorsStack.Screen name="EditAuthor" component={EditAuthorScreen} />
  </AuthorsStack.Navigator>
);


// BORROWED STACK
const BorrowedStackScreen = () => (
  <BorrowedStack.Navigator screenOptions={{ headerShown: false }}>
    <BorrowedStack.Screen name="BorrowedList" component={BorrowedBooksScreen} />
  </BorrowedStack.Navigator>
);


// USERS STACK
const UsersStackScreen = () => (
  <UsersStack.Navigator screenOptions={{ headerShown: false }}>
    <UsersStack.Screen name="UsersList" component={UsersScreen} />
  </UsersStack.Navigator>
);


export const MainNavigator = () => {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // ← HIDDEN EVERYWHERE
        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          height: 64,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Books"
        component={BooksStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Authors"
        component={AuthorsStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <PenSquare color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Borrowed"
        component={BorrowedStackScreen}
        options={{
          tabBarLabel: 'My Books',
          tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Users"
        component={UsersStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />

      {/* EXTRA TAB FOR LOGOUT */}
      <Tab.Screen
        name="Logout"
        component={View}
        listeners={{
          tabPress: () => logout(),
        }}
        options={{
          tabBarIcon: () => <LogOut size={24} color="red" />,
          tabBarLabel: 'Logout',
        }}
      />
    </Tab.Navigator>
  );
};
